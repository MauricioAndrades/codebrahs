
<template lang="pug">
  .hero(:style="heroBackgroundImage")
    .overlay(v-if="overlayColor" :style="heroBackgroundOverlay")
    .container(:style="containerStyles")
      .hero__content(:style="textStyles")
        slot
</template>

<script>
  export default {
    name: 'Hero',
    props: {
      image: String,
      minHeight: {
        type: String,
        default: '50vh'
      },
      overlayColor: {
        type: String,
        default: null
      },
      overlayOpacity: {
        type: String, // Range slider value gets passed as string, needs to be converted to num when used
        default: '0'
      },
      textAlign: {
        type: String,
        default: 'center'
      },
      textPositionVertical: {
        type: String,
        default: 'center'
      },
      textPositionHorizontal: {
        type: String,
        default: 'center'
      },
      textColor: {
        type: String,
        default: null
      }
    },
    computed: {
      heroBackgroundImage () {
        return {
          'background-image': `url(${this.image})`
        }
      },
      heroBackgroundOverlay () {
        return {
          'background-color': this.overlayColor,
          'opacity': Number(this.overlayOpacity)
        }
      },
      containerStyles () {
        return {
          'justify-content': this.textPositionHorizontal,
          'align-items': this.textPositionVertical,
          'min-height': this.minHeight
        }
      },
      textStyles () {
        return {
          'text-align': this.textAlign,
          'color': this.textColor
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .hero {
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 30px;

    .overlay {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .container {
      padding-top: 30px;
      padding-bottom: 30px;
      display: flex;

      @include tablet-up {
        padding-top: 50px;
        padding-bottom: 50px;
      }

      .hero__content {
        z-index: 2; // Place above the overlay
      }
    }
  }
</style>
