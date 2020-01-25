
<template lang="pug">
  form.product-form(@submit.prevent="addToCart", novalidate)
    .product-form__options(v-if="hasSubscription")
      .product-form__options__single
        radio-button(:value="purchaseTypeSingle", v-model="selectedPurchaseType")
          template #[strong {{ product.price | money }}] One-time purchase
      .product-form__options__recurring
        radio-button(:value="purchaseTypeRecurring", v-model="selectedPurchaseType", @click.native="selectRecurring")
          template 
            strong {{ subscriptionPrice | money }} 
            | Subscribe and deliver every&nbsp;
            .product-form__options__duration-wrapper
              select.product-form__options__duration(v-model="selectedFrequency", @click.capture)
                option(v-for="frequency in subscriptionFrequencies", :value="frequency", :key="frequency") {{ frequency }} {{ subscriptionUnitType }}
              icon(name="chevron-down", size="9px")
    p.product-form__price(v-else) 
      strong {{ product.price | money }}
    transition(name="fade")
      p.product-form__savings(v-if="subscriptionSavings > 0 && selectedPurchaseType === purchaseTypeRecurring") You are saving {{ subscriptionSavings | money }} by choosing a subscription.
    .product-form__atc
      quantity-input.product-form__quantity(
        label="Quantity", 
        v-model="quantity",
        :min="1", 
        :max="remainingQuantity"
      )
      submit-button(
        :label="buttonLabel", 
        :inline="true",
        :disabled="isDisabled",
        :loading="adding"
      )
</template>

<script>
  import { mapState } from 'vuex'
  import {
    getRecurringProductId,
    getRecurringProductDiscount,
    getRecurringProductFrequencies,
    getRecurringProductUnitType,
    getRecurringProductSubscriptionId
  } from 'scripts/lib/util.tags.js'

  import RadioButton from 'scripts/components/forms/RadioInput.vue'
  import QuantityInput from 'scripts/components/forms/QuantityInput.vue'
  import SubmitButton from 'scripts/components/buttons/SubmitButton.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'ProductForm',
    components: { RadioButton, QuantityInput, SubmitButton, Icon },
    props: {
      product: Object
    },
    data () {
      const PURCHASE_TYPE_SINGLE = 'single'
      const PURCHASE_TYPE_RECURRING = 'recurring'

      return {
        quantity: 1,
        adding: false,
        selectedPurchaseType: PURCHASE_TYPE_SINGLE,
        purchaseTypeSingle: PURCHASE_TYPE_SINGLE,
        purchaseTypeRecurring: PURCHASE_TYPE_RECURRING,
        selectedFrequency: ''
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all
      }),
      remainingQuantity () {
        return this.product.variants[0].remaining_quantity
      },
      isDisabled () {
        return this.adding || this.remainingQuantity <= 0
      },
      buttonLabel () {
        return (this.remainingQuantity > 0) ? 'Add to Cart' : 'Sold Out'
      },
      subscriptionProductId () {
        return getRecurringProductId(this.product.tags)
      },
      hasSubscription () {
        return Boolean(this.subscriptionProductId)
      },
      isSubscriptionSelected () {
        return this.selectedPurchaseType === this.purchaseTypeRecurring
      },
      subscriptionFrequencies () {
        return this.hasSubscription ? getRecurringProductFrequencies(this.product.tags) : []
      },
      subscriptionUnitType () {
        return this.hasSubscription ? getRecurringProductUnitType(this.product.tags) : ''
      },
      subscriptionId () {
        return this.hasSubscription ? getRecurringProductSubscriptionId(this.product.tags) : ''
      },
      subscriptionDiscount () {
        return this.hasSubscription ? getRecurringProductDiscount(this.product.tags) / 100 : 0
      },
      subscriptionPrice () {
        return Math.round(this.product.price - this.product.price * this.subscriptionDiscount)
      },
      subscriptionSavings () {
        return this.product.price - this.subscriptionPrice
      }
    },
    mounted () {
      if (this.hasSubscription) {
        this.selectedFrequency = this.subscriptionFrequencies[0]
      }
    },
    methods: {
      addToCart () {
        let addProduct = {
          id: this.product.variants[0].id,
          quantity: this.quantity 
        }

        this.adding = true

        if (this.isSubscriptionSelected) {
          addProduct.id = this.subscriptionProductId
          addProduct.properties = {
            shipping_interval_frequency: String(this.selectedFrequency),
            shipping_interval_unit_type: this.subscriptionUnitType,
            subscription_id: this.subscriptionId
          }
        }

        this.$store.dispatch('cart/addItem', addProduct)
          .then(() => this.$store.dispatch('cart/openSidecart'))
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.adding = false)
      },
      selectRecurring () {
        this.selectedPurchaseType = this.purchaseTypeRecurring
      }
    }
  }
</script>

<style lang="scss">
  .product-form {
    margin-top: 36px;

    &__price {
      font-size: rem(16);
      margin-bottom: 15px;
      line-height: 20px;
    }
    
    &__atc {
      display: flex;
    }

    &__quantity {
      margin-right: 14px;

      > label {
        margin-right: 5px;
      }
    }

    &__options {
      &__single,
      &__recurring {
        margin-bottom: 15px;
      }

      &__recurring {
        display: flex;
      }

      &__duration {
        display: inline-block;
        border: none;
        background-color: transparent;
        color: $color--primary;
        font-weight: bold;
        padding-right: 20px;
        padding-left: 4px;
        line-height: 20px;
        -webkit-appearance: none;

        &::-ms-expand {
          display: none;
        }
      }

      &__duration-wrapper {
        position: relative;
        display: inline-block;
      }

      .icon {
        position: absolute;
        pointer-events: none;
        top: 50%;
        right: 6px;
        transform: translateY(-50%);
        fill: $color--primary;
      }
    }

    &__variant-select-wrapper {
      display: flex;
      margin-bottom: 16px;
    }

    &__savings {
      font-size: rem(12);
      line-height: 1.4;
      margin-top: 10px;
      margin-bottom: 10px;

      @include mobile-only {
        text-align: center;
      }
    }
  }
</style>