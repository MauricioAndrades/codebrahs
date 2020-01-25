
<template lang="pug">
  tr.cart__line-item
    td.cart__line-item__product-image
      img.cart__line-item__image(v-lazy="item.image", :alt="item.product_title")
    td.cart__line-item__product-title
      a(:href="item.url") {{ itemName }}
      br
      a.loader(href="#", @click.prevent="removeItem") 
        small Remove
    td
      p.u-text-compare-at(v-if="isDiscounted && !isGiftWithPurchase") {{ comparePrice | money }}
      p(v-if="!isGiftWithPurchase", :class="{ 'u-text-discount': isDiscounted }") {{ item.price | money }}
      p(v-else) FREE
    td
      .cart__line-item__quantity
        quantity-input.cart__line-item__quantity--input(
          v-model="quantity",
          :disable-increment="isGiftWithPurchase"
        )
    td.cart__line-item__product-price(v-if="isGiftWithPurchase") FREE
    td.cart__line-item__product-price(v-else) {{ item.line_price | money }}
</template>

<script>
  import { mapState } from 'vuex'
  import { debounce } from 'scripts/lib/util.js'

  import QuantityInput from 'scripts/components/forms/QuantityInput.vue'
  import NumberInput from 'scripts/components/forms/NumberInput.vue'

  export default {
    name: 'CartLineItem',
    components: { QuantityInput, NumberInput },
    props: {
      item: Object,
      line: Number,
    },
    data () {
      return {
        quantity: this.item.quantity
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all
      }),
      product () {
        return this.allProducts.find(product => {
          return Boolean(product.variants.find(variant => this.item.id === variant.id))
        })
      },
      variant () {
        return this.product ? this.product.variants.find(variant => variant.id === this.item.id) : null
      },
      hasBaseProduct () {
        return this.item.properties && this.item.properties._base_product;
      },
      baseProduct () {
        if(this.hasBaseProduct) {
          return this.allProducts.find(product => product.handle === this.item.properties._base_product)
        }

        return null;
      },
      itemName () {
        if(this.baseProduct) {
          const freq = this.item.properties.shipping_interval_frequency,
                unit = this.item.properties.shipping_interval_unit_type

          return `${this.item.product_title} - ${freq} ${unit} Subscription`;
        }

        return this.item.product_title;
      },
      comparePrice () {
        if(this.baseProduct) {
          return this.baseProduct.price;
        }

        return (this.variant) ? parseInt(this.variant.compare_at_price, 10) : this.item.price
      },
      isDiscounted () {
        return this.item.price !== this.comparePrice && !isNaN(this.comparePrice)
      },
      isGiftWithPurchase () {
        return Boolean(this.item.properties && this.item.properties._gwp)
      }
    },
    watch: {
      quantity (newVal, oldVal) {
        if (newVal != oldVal) {
          this.updateItem()
        }
      }
    },
    created () {
      if(this.hasBaseProduct && !this.baseProduct) {
        this.$store.dispatch('products/addProduct', this.item.properties._base_product)
      }
    },
    methods: {
      updateItem: debounce(function () {
        if (this.quantity > 0) {
          this.$store.dispatch('cart/updateItem', { line: this.line, quantity: this.quantity })
        } else {
          this.removeItem()
        }
      }, 500),
      removeItem () {
        if (this.isGiftWithPurchase) this.$emit('gwp-cancelled')
        this.$store.dispatch('cart/removeItem', this.line)
      }
    }
  }
</script>

<style scoped lang="scss">
  .cart__line-item {
    &__image {
      max-width: 240px;

      @include tablet-up {
        max-width: 200px;
      }
    }

    &__product-image {
      width: 150px;

      @include tablet-up {
        width: 200px;
      }
    }

    &__product-title {
      max-width: 250px;
    }

    td:not(.cart__line-item__product-title) {
      text-align: center;
    }

    &__quantity {
      display: flex;
      align-items: center;

      .loading {
        width: 20px;
        height: 20px;
      }

      &--input {
        margin: 0 auto;
      }
    }
  }
</style>