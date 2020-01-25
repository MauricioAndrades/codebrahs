
<template lang="pug">
  transition(name="slide-fade-left")
    .sidecart__line-item(v-if="item", :class="itemClass")
      .sidecart__line-item__image-wrapper
        img.sidecart__line-item__image(:src="item.image", :alt="item.product_title")
      .sidecart__line-item__content
        .sidecart__line-item__header
          p.sidecart__line-item__title {{ itemName }}
          icon-button.sidecart__line-item__remove(label="Remove", icon="close", size="10px", @click="removeItem")
        .sidecart__line-item__details
          .sidecart__line-item__quantity
            icon-button.sidecart__line-item__quantity__change(label="Decrement Count", icon="minus", size="8px", @click="decrement")
            p.sidecart__line-item__quantity__label {{ item.quantity }}
            icon-button.sidecart__line-item__quantity__change(label="Increment Count", icon="plus", size="8px", :disabled="isGiftWithPurchase", @click="increment")
          p.sidecart__line-item__price 
            span.sidecart__line-item__price--compare-at(v-if="isDiscounted && !isGiftWithPurchase") {{ comparePrice | money }}
            span(v-if="!isGiftWithPurchase", :class="{ 'sidecart__line-item__price--discount': isDiscounted }") {{ item.line_price | money }}
            span(v-else) FREE
</template>

<script>
  import { mapState } from 'vuex'
  import { debounce } from 'scripts/lib/util.js'
  
  import IconButton from 'scripts/components/buttons/IconButton.vue'

  export default {
    name: 'SidecartLineItem',
    components: { IconButton },
    props: {
      item: Object,
      line: Number
    },
    data () {
      return {
        updating: false
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all
      }),
      itemClass () {
        return {
          'updating': this.updating
        }
      },
      product () {
        return this.allProducts.find(product => {
          return Boolean(product.variants.find(variant => this.item.id === variant.id))
        })
      },
      variant () {
        return this.product ? this.product.variants.find(variant => variant.id === this.item.id) : null
      },
      hasBaseProduct () {
        return this.item.properties && !!this.item.properties._base_product;
      },
      baseProduct () {
        if(this.hasBaseProduct) {
          return this.allProducts.find(product => product.handle === this.item.properties._base_product)
        }

        return null;
      },
      itemName () {
        if(this.baseProduct) {
          const freq = this.item.properties.shipping_interval_frequency
          const unit = this.item.properties.shipping_interval_unit_type

          return `${this.item.product_title} - ${freq} ${unit} Subscription`;
        }

        return this.item.product_title;
      },
      comparePrice () {
        if(this.baseProduct) {
          return this.baseProduct.price * this.item.quantity;
        }

        return (this.variant) ? parseInt(this.variant.compare_at_price, 10) * this.item.quantity : this.item.price * this.item.quantity
      },
      isDiscounted () {
        return this.item.price !== this.comparePrice && !isNaN(this.comparePrice)
      },
      isGiftWithPurchase () {
        return Boolean(this.item.properties && this.item.properties._gwp)
      }
    },
    methods: {
      removeItem () {
        this.updating = true
        if (this.isGiftWithPurchase) this.$emit('gwp-cancelled')

        this.$store.dispatch('cart/removeItem', this.line)
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
      },
      increment () {
        this.updateQuantity(this.item.quantity + 1)
      },
      decrement () {
        if (this.item.quantity > 0) {
          this.updateQuantity(this.item.quantity - 1)
        }
      },
      updateQuantity: debounce(function (newQuantity) {
        this.updating = true

        if (newQuantity < 1) {
          this.removeItem()
          return
        }

        this.$store.dispatch('cart/updateItem', { line: this.line, quantity: newQuantity })
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
      }, 100)
    },
    created () {
      if(this.hasBaseProduct && !this.baseProduct) {
        this.$store.dispatch('products/addProduct', this.item.properties._base_product)
      }
    }
  }
</script>

<style scoped lang="scss">
  .sidecart__line-item {
    display: flex;
    position: relative;
    padding: 14px 0;
    border-bottom: 1px solid $border--light;

    &.updating {
      opacity: 0.5;
      pointer-events: none;

      &.slide-fade-left-leave-active {
        opacity: 0;
      }
    }

    &__image-wrapper {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      padding: 10px;
    }

    &__image {
      max-height: 100%;
      flex-shrink: 0;
    }

    &__content {
      padding-left: 24px;
      flex-grow: 1;
    }

    &__header,
    &__details {
      display: flex;
    }

    &__details {
      justify-content: space-between;
      margin-top: 10px;
    }

    &__title {
      flex-grow: 1;
      padding-right: 8px;
      margin: 0;
      font-size: rem(13);
      line-height: 1.5;
      min-height: 40px;
      font-weight: bold;
    }

    &__remove {
      align-self: flex-start;
      margin-top: 5px;
    }

    &__price {
      text-align: right;
      flex-grow: 1;
      line-height: 32px;
      font-size: rem(15);
      margin: 0;

      &--compare-at {
        color: $color--disabled;
        text-decoration: line-through;
      }

      &--discount {
        color: $color--accent;
        font-weight: bold;
        margin-left: 8px;
      }
    }

    &__quantity {
      display: flex;
      border: 2px solid $color--primary;
      border-radius: 22px;

      &__label {
        width: 27px;
        font-size: rem(15);
        line-height: 28px;
        color: $color--primary;
        text-align: center;
        font-weight: bold;
        margin: 0;
      }

      .icon {
        fill: $color--primary;
      }

      &__change {
        width: 37px;
        height: 28px;

        &[disabled] {
          background-color: transparent;
          opacity: 0.3;
        }
      }
    }
  }
</style>