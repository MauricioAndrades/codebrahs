
<template lang="pug">
  button.button.button--icon(
    type="button", 
    :class="buttonClass", 
    :disabled="disabled", 
    @click="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'
  import PrimaryButton from 'scripts/components/buttons/PrimaryButton.vue'

  export default {
    extends: PrimaryButton,
    components: { Icon },
    name: 'IconButton',
    props: {
      size: String
    }
  }
</script>

<style scoped lang="scss">
</style>