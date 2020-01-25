
<template lang="pug">
  .sidecart-wrapper
    transition(name="fade")
      .sidecart__overlay(v-if="sidecartOpen", @click="$store.dispatch('cart/closeSidecart')")
    transition(name="off-canvas-right")
      .sidecart(v-if="sidecartOpen")
        .sidecart__header
          h2.sidecart__title My Cart ({{ totalItems }})
          icon-button.sidecart__close(icon="close", size="20px", label="Close side cart", @click="$store.dispatch('cart/closeSidecart')")
        .sidecart__promo(v-if="promoMessage")
          p.sidecart__promo__copy {{ promoMessage }}
        .sidecart__container
          transition(name="fade", mode="out-in")
            .sidecart__contents-wrapper(v-if="totalItems > 0", key="content")
              .sidecart__contents
                sidecart-line-item(
                  v-for="(item, index) in items", 
                  :item="item", 
                  :line="index + 1", 
                  :key="item.id",
                  @gwp-cancelled="cancelThresholdProduct"
                )
                transition(name="fade")
                  .sidecart__threshold-promo(v-if="showThresholdPromo")
                    img.sidecart__threshold-promo__image(:src="thresholdProduct.images[0].src" :alt="thresholdProduct.title")
                    h3.sidecart__threshold-promo__title Add {{ remainingThresholdValue | money }} to your cart for this free gift.
                    p.sidecart__threshold-promo__description {{ thresholdDescription }}
              .sidecart__footer
                p.sidecart__subtotal Subtotal: {{ totalPrice | money }}
                link-button.sidecart__checkout-cta(:full="true", href="/cart", label="View Cart")
            .sidecart__empty(v-else, key="empty")
              img.sidecart__empty__image(:src="emptyImage", :alt="emptyImageAlt", v-if="emptyImage")
              p.sidecart__empty__message {{ emptyText }}
              link-button(href="/collections/all-products", label="Start Shopping")
</template>

<script>
  import { mapState } from 'vuex'
  import { gwpTypes, gwpStorageCancelledKeys } from 'scripts/lib/config.gwp.js'

  import IconButton from 'scripts/components/buttons/IconButton.vue'
  import LinkButton from 'scripts/components/buttons/LinkButton.vue'
  import SidecartLineItem from 'scripts/components/cart/SidecartLineItem.vue'

  const GWP_TYPE_THRESHOLD = gwpTypes.threshold
  const GWP_THRESHOLD_CANCELLED_KEY = gwpStorageCancelledKeys.threshold

  export default {
    name: 'Sidecart',
    components: { LinkButton, IconButton, SidecartLineItem },
    props: {
      promoMessage: String,
      emptyText: String,
      emptyImage: String,
      emptyImageAlt: String,
      thresholdProductHandle: String,
      thresholdDescription: String,
      thresholdValue: Number
    },
    data () {
      return {
        thresholdProductCancelled: Boolean(window.sessionStorage.getItem(GWP_THRESHOLD_CANCELLED_KEY))
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all,
        sidecartOpen: state => state.cart.sidecartOpen,
        items: state => state.cart.checkout.items,
        itemsSubtotal: state => state.cart.checkout.items_subtotal_price,
        totalDiscount: state => state.cart.checkout.total_discount,
        totalPrice: state => state.cart.checkout.total_price,
        totalItems: state => state.cart.checkout.item_count
      }),
      thresholdProduct () {
        return (this.allProducts) 
          ? this.allProducts.find(p => p.handle === this.thresholdProductHandle)
          : false
      },
      hasMetThreshold () {
        return this.thresholdValue 
          ? this.totalPrice >= this.thresholdValue 
          : false
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
      },
      showThresholdPromo () {
        return this.thresholdProduct && !this.hasMetThreshold && !this.thresholdProductCancelled
      },
      remainingThresholdValue () {
        return Math.max(this.thresholdValue - this.totalPrice, 0)
      }
    },
    watch: {
      totalPrice (newVal, oldVal) {
        this.checkGiftWithPurchase()
      }
    },
    mounted () {
      if (this.thresholdProductHandle) {
        this.$store.dispatch('products/addProduct', this.thresholdProductHandle)
      }
    },
    methods: {
      checkGiftWithPurchase () {
        this.thresholdProductCancelled = Boolean(window.sessionStorage.getItem(GWP_THRESHOLD_CANCELLED_KEY))

        // has met threshold
        if (this.hasMetThreshold) {
          if (!this.thresholdProductCancelled && this.thresholdProduct && !this.hasThresholdProduct) {
            this.addThresholdProduct()
          }

        // has not met threshold, and currently has gift
        } else if (this.hasThresholdProduct) {
          this.removeThresholdProduct()
        }
      },
      addThresholdProduct () {
        this.$store.dispatch('cart/addItem', {
          id: this.thresholdProduct.variants[0].id,
          quantity: 1,
          properties: { '_gwp': GWP_TYPE_THRESHOLD }
        })
      },
      removeThresholdProduct () {
        let line = this.items.findIndex(p => {
          return p.handle === this.thresholdProductHandle 
            && p.properties
            && p.properties._gwp === GWP_TYPE_THRESHOLD
        }) + 1

        this.$store.dispatch('cart/removeItem', line)
      },
      cancelThresholdProduct () {
        this.thresholdProductCancelled = true
        window.sessionStorage.setItem(GWP_THRESHOLD_CANCELLED_KEY, 'true')
      }
    }
  }
</script>

<style scoped lang="scss">
  .sidecart {
    display: flex;
    flex-direction: column;
    background-color: $bg--main;

    @include tablet-up {
      max-width: 480px;
    }

    &, &__overlay {
      position: fixed;
      right: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }

    &__overlay {
      background-color: $color-transparent-black;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border--light;
    }

    &__header,
    &__footer {
      padding: $grid-gutter;
      flex-shrink: 0;
    }

    &__footer {
      padding-top: 8px;
      border-top: 1px solid $border--light;
    }

    &__promo {
      background-color: $bg--light;
      padding: 15px $grid-gutter;

      &__copy {
        margin: 0;
        padding: 0;
        text-align: center;
        font-size: rem(13);
        line-height: 1.5;
        font-weight: bold;
      }
    }

    &__threshold-promo {
      text-align: center;
      padding: 46px 0;
      flex-shrink: 0;

      &__image {
        margin-bottom: 35px;
        max-height: 133px;
        margin: 0 auto;
      }

      &__title {
        margin: 0 0 6px;
        font-size: rem(18);
        line-height: 1.35;
      }

      &__description {
        margin: 0;
        font-size: rem(15);
        line-height: 1.6;
      }
    }

    &__container {
      display: flex;
      flex-grow: 1;
      min-height: 0; // override auto to prevent growing too tall
    }

    &__contents {
      flex-grow: 1;
      padding: 0 $grid-gutter;
      overflow-y: auto;
      overflow-x: hidden;

      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
      }
    }

    &__title {
      padding-right: 22px $grid-gutter;
      margin: 0;
      font-size: rem(21);
      line-height: 1.3;
    }

    &__subtotal {
      font-size: rem(15);
      line-height: 1.6;
      color: $text--mid;
      text-align: center;
      font-weight: bold;
    }

    &__checkout-cta {
      margin-top: 10px;
    }

    &__empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      padding: 0 $grid-gutter;

      &__message {
        font-size: rem(24);
        line-height: 1.375;
        font-weight: bold;
      }
      
      &__image,
      &__message {
        margin: 0 0 24px;
      }
    }
  }
</style>
