
<template lang="pug">
  a.button.button--icon(
    :class="buttonClass", 
    :disabled="disabled",
    :href="href",
    :title="label"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'
  import IconButton from 'scripts/components/buttons/IconButton.vue'

  export default {
    extends: IconButton,
    name: 'IconLink',
    components: { Icon },
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