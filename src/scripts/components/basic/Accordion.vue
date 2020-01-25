
<template lang="pug">
  .accordion(:class="accordionClass")
    a.accordion__header(href="#", :class="headerClass", @click.prevent="activate") 
      span {{ heading }}
      icon(:name="currentIcon", size="13px")
    transition(:name="transition")
      .accordion__content(v-if="active", ref="content", :style="contentStyle")
        slot
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'Accordion',
    components: { Icon },
    props: {
      heading: {
        type: String,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      },
      activeIcon: {
        type: String,
        default: 'plus'
      },
      inactiveIcon: {
        type: String,
        default: 'minus'
      },
      theme: {
        type: String,
        default: 'default',
        validator (value) {
          return [
            'default',
            'footer'
          ].includes(value)
        }
      }
    },
    data () {
      return {
        active: true,
        contentStyle: {},
        scrollHeight: 0,
        transition: 'none'
      }
    },
    computed: {
      accordionClass () {
        let classes = []

        if (this.theme !== 'default') {
          classes.push(`accordion--${this.theme}`)
        }

        return classes
      },
      headerClass () {
        return {
          'is-open': this.active
        }
      },
      currentIcon () {
        return (this.active) ? this.activeIcon : this.inactiveIcon
      }
    },
    mounted () {
      let height = this.$refs.content.scrollHeight
      
      this.contentStyle = {
        'max-height': `${height}px`
      }

      // NOTE: this has to be set to false after mount or scrollHeight will be 0
      this.active = this.selected
      this.transition = 'slide-vertical'
      
      if (this.$parent.addAccordion) {
        this.$parent.addAccordion(this)
      }
    },
    beforeDestroy () {
      this.active = false
      if (this.$param.removeAccordion) {
        this.$parent.removeAccordion(this)
      }
    },
    methods: {
      activate () {
        if (this.$parent.activate && !this.active) {
          this.$parent.activate(this)
        } else {
          this.active = !this.active
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .accordion {
    &.accordion--footer {
      border-top: 1px solid $text--light;
      background-color: transparent;

      &:last-child {
        border-bottom: 1px solid $text--light;
      }
    }

    &__header {
      width: 100%;
      padding: $grid-gutter;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
    }

    &__content {
      overflow: hidden;
      padding: 0 $grid-gutter $grid-gutter;
      
      &--wrapper {
        overflow: hidden;
      }
    }

    &__header,
    &__content {
      .accordion--footer & {
        color: $text--light;
      }
    }

    &__icon {
      .accordion--footer & {
        fill: $text--light;
      }
    }
  }
</style>