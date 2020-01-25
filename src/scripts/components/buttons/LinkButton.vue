
<template lang="pug">
  a.button(:href="href", :class="buttonClass", :disabled="disabled")
    icon(v-if="icon", :name="icon", :size="iconSize")
    span {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'
  import PrimaryButton from 'scripts/components/buttons/PrimaryButton.vue'

  export default {
    extends: PrimaryButton,
    components: { Icon },
    name: 'LinkButton',
    props: {
      href: {
        type: String,
        default: '#'
      }
    }
  }
</script>

<style scoped lang="scss">
</style>