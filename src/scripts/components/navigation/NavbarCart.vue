
<template lang="pug">
  .navbar__cart
    icon-button(:icon="cartIcon", label="Open Cart", @click="$store.dispatch('cart/openSidecart')")
    span.navbar__cart__quantity(v-if="numCartItems > 0")
      span.navbar__cart__count {{ numCartItems }}
</template>

<script>
  import { mapState } from 'vuex'

  import IconButton from 'scripts/components/buttons/IconButton.vue'

  export default {
    name: 'NavbarCart',
    components: { IconButton },
    computed: {
      ...mapState({
        checkout: state => state.cart.checkout
      }),
      numCartItems () {
        return this.checkout.item_count || 0;
      },
      cartIcon () {
        return this.numCartItems > 0 ? 'cart-full' : 'cart'
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar__cart {
    position: relative;

    &__quantity {
      position: absolute;
      display: block;
      top: -8px;
      right: -11px;
      height: 18px;
      width: 18px;
      border-radius: 50%;
      pointer-events: none;
      background-color: $color--primary;
      transition: 0.3s ease all;
    }

    &__count {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: rem(10);
      line-height: 15px;
      transform: translate(-50%, -50%);
      color: $text--light;
      font-size: rem(12);
      font-weight: bold;
    }
  }
</style>