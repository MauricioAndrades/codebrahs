
<template lang="pug">
  a.product-tile.u-no-link(:href="url", :class="tileClass", @mouseover="enter", @mouseleave="leave")
    img.product-tile__image(:src="currentImage", :alt="imageAlt")
    .product-tile__content
      h3.product-tile__title {{ title }}
      .product-tile__details
        p.product-tile__price {{ price | money }}
        p.product-tile__quantity(v-if="remainingQuantity < 10", :class="quantityClass") {{ quantityLabel }}
        .product-tile__cta(v-if="!horizontal")
          primary-button(label="Shop Now")
</template>

<script>
  import PrimaryButton from 'scripts/components/buttons/PrimaryButton.vue'

  export default {
    name: 'ProductTile',
    components: { PrimaryButton },
    data () {
      return {
        hovered: false
      }
    },
    props: {
      title: String,
      tagline: String,
      url: String,
      image: String,
      hoverImage: String,
      imageAlt: String,
      price: Number,
      remainingQuantity: Number,
      disableHover: {
        type: Boolean,
        default: false
      },
      horizontal: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      currentImage () {
        return (this.hovered && !this.disableHover && this.hoverImage) ? this.hoverImage : this.image
      },
      tileClass () {
        return {
          'disable-hover': this.disableHover,
          'product-tile--horizontal': this.horizontal
        }
      },
      quantityClass () {
        return {
          'product-tile__quantity--limited': this.remainingQuantity > 0,
          'product-tile__quantity--oos': this.remainingQuantity <= 0
        }
      },
      quantityLabel () {
        return (this.remainingQuantity > 0) ? 'Limited quantities!' : 'Out of stock'
      }
    },
    methods: {
      enter () {
        if (!this.disableHover) this.hovered = true
      },
      leave () {
        this.hovered = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .product-tile {
    position: relative;
    background-color: $bg--light;
    padding: 15px;
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    margin: 2px;

    &--horizontal {
      padding: 12px;
      flex-direction: row-reverse;
      text-align: left;
      justify-content: space-between;
    }
    
    @include tablet-up {
      padding: 30px;
    }

    .slide & {
      height: 100%;
    }

    &__image {
      margin: 0 auto 20px;

      .product-tile--horizontal & {
        margin: 0;
        max-width: 70px;
        align-self: center;
      }
    }
    
    &__title {
      margin: 0 0 6px;
      font-size: rem(15);
      line-height: 1.4;
      
      @include tablet-up {
        font-size: rem(18);
      }

      .product-tile--horizontal & {
        font-size: rem(18);
      }
    }

    &__quantity {
      font-weight: bold;
      margin-top: 12px;
      transition: 0.3s ease all;

      &--limited {
        color: $text--accent;
      }

      &--oos {
        color: $text--mid;
      }
    }
    
    &__price {
      margin: 0;
      font-size: rem(14);
      line-height: 1.4;
      
      @include tablet-up {
        font-size: rem(18);
      }

      .product-tile--horizontal & {
        font-size: rem(18);
      }
    }

    &__cta {
      padding-top: 10px;
    }
  }
</style>
