
<template lang="pug">
  .input.input--select
    label.u-hidden(v-if="label") {{ label }}
    select(v-model="currentValue")
      option(v-if="!required", value="") {{ defaultOption }}
      option(v-for="option in options", :value="option.value", :key="option.value") {{ option.label }}
    icon(name="chevron-down", size="9px")
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'SelectInput',
    extends: TextInput,
    components: { Icon },
    props: {
      options: {
        type: Array,
        default: () => []
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      defaultOption () {
        return (this.placeholder !== '') ? this.placeholder : ''
      }
    },
    created () {
      if (this.required && this.currentValue === '' && this.options.length > 0) {
        this.currentValue = this.options[0].value
        this.$emit('input', this.currentValue)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>