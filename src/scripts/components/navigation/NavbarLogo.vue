
<template lang="pug">
  .navbar__logo
    h1(v-if="h1")
      a.navbar__logo__image(href="/")
        img(:src="image", :srcset="imageSource", :alt="alt")
        span.u-hidden {{ alt }}
    div(v-else)
      a.navbar__logo__image(href="/")
        img(:src="image", :srcset="imageSource", :alt="alt")
</template>

<script>
  export default {
    name: 'NavbarLogo',
    props: {
      image: String,
      largeImage: String,
      alt: String,
      h1: Boolean
    },
    computed: {
      imageSource () {
        return `${this.image} 1x, ${this.largeImage} 2x`
      }
    }
  }
</script>

<style scoped lang="scss">
  h1 {
    margin: 0;
  }

  .navbar__logo__image {
    display: flex;
    align-items: center;
    
    img {
      max-width: 115px;

      @include mobile-only {
        max-height: 40px;
      }
      
      @include tablet-up {
        max-width: 140px;
      }
    }
  }
</style>