
<template lang="pug">
  .input.input--text
    label(v-if="label") {{ label }}
    input(type="text", :placeholder="placeholder", v-model="currentValue")
</template>

<script>
  export default {
    name: 'TextInput',
    props: {
      value: [String, Number],
      label: String,
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      }
    },
    data () {
      return {
        initialized: false,
        currentValue: this.value
      }
    },
    watch: {
      currentValue (p, c) {
        this.$emit('input', this.currentValue)
      }
    },
    methods: {
      set (val) {
        this.currentValue = val
      }
    }
  }
</script>

<style scoped lang="scss">
</style>