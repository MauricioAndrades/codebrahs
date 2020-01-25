
<template lang="pug">
  .cart
    transition(name="fade", mode="out-in")
      .cart__contents(v-if="totalItems > 0", key="contents")
        table
          thead
            tr
              th
              th.cart__product-header {{ productColumnLabel }}
              th {{ priceColumnLabel }}
              th {{ quantityColumnLabel }}
              th {{ totalColumnLabel }}
          transition-group(name="slide-fade-left", tag="tbody")
            cart-line-item(
              v-for="(item, index) in items", 
              :item="item",
              :line="index + 1",
              :key="item.id",
              @gwp-cancelled="cancelThresholdProduct"
            )
        p.cart__total Total: {{ totalPrice | money }}
        form.cart__form(action="/cart", method="post", novalidate)
          submit-button.cart__checkout-cta(label="Check Out", name="checkout")
      .cart__empty(v-else, key="empty")
        img.cart__empty__image(v-if="emptyImage", v-lazy="emptyImage", :alt="emptyImageAlt")
        p.cart__empty__text {{ emptyText }}
        link-button(href="/collections/all-products", label="Continue Shopping")
</template>

<script>
  import { mapState } from 'vuex'
  import { gwpTypes, gwpStorageCancelledKeys } from 'scripts/lib/config.gwp.js'

  import PrimaryButton from 'scripts/components/buttons/PrimaryButton.vue'
  import LinkButton from 'scripts/components/buttons/LinkButton.vue'
  import SubmitButton from 'scripts/components/buttons/SubmitButton.vue'
  import CartLineItem from 'scripts/components/cart/CartLineItem.vue'

  const GWP_TYPE_THRESHOLD = gwpTypes.threshold
  const GWP_THRESHOLD_CANCELLED_KEY = gwpStorageCancelledKeys.threshold

  export default {
    name: 'Cart',
    components: { PrimaryButton, SubmitButton, LinkButton, CartLineItem },
    props: {
      productColumnLabel: String,
      priceColumnLabel: String,
      quantityColumnLabel: String,
      totalColumnLabel: String,
      emptyImage: String,
      emptyImageAlt: String,
      emptyText: String,
      thresholdProductHandle: String
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all,
        items: state => state.cart.checkout.items,
        itemsSubtotal: state => state.cart.checkout.items_subtotal_price,
        totalDiscount: state => state.cart.checkout.total_discount,
        totalPrice: state => state.cart.checkout.total_price,
        totalItems: state => state.cart.checkout.item_count
      }),
      thresholdProduct () {
        return this.thresholdProductHandle ? this.allProducts.find(p => p.handle === this.thresholdProductHandle) : false
      },
      hasThresholdProduct () {
        let thresholdProductItem = (this.items)
          ? this.items.find(p => {
            return this.thresholdProduct
              && p.id === this.thresholdProduct.variants[0].id 
              && p.properties 
              && p.properties._gwp === GWP_TYPE_THRESHOLD
          })
          : false

        return this.thresholdProduct ? Boolean(thresholdProductItem) : false
      }
    },
    methods: {
      cancelThresholdProduct () {
        window.sessionStorage.setItem(GWP_THRESHOLD_CANCELLED_KEY, 'true')
      }
    }
  }
</script>

<style scoped lang="scss">
  .cart {
    &__checkout-cta {
      float: right;
    }

    &__product-header {
      text-align: left;
    }

    &__total,
    &__subtotal,
    &__discount {
      text-align: right;
      margin-bottom: 10px;
    }

    td,
    th {
      &:not(:first-child) {
        padding-left: $grid-gutter / 2;
      }

      &:not(:last-child) {
        padding-right: $grid-gutter / 2;
      }
    }

    &__empty {
      padding: 40px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &__text {
        font-size: rem(24);
        line-height: 1.375;
        font-weight: bold;
      }

      &__image,
      &__text {
        margin: 0 0 24px;
      }
    }

    &__form {
      @include clearfix;
      margin-bottom: 40px;
    }
  }
</style>
