<template>
  <m-default-layout
    :menuItems="menuItems"
  >
    <template v-slot:topbar>
    </template>

    <Nuxt />
  </m-default-layout>
</template>

<script>

export default {

  data(){
    return {
 
    }
  },

  computed: {
    menuItems(){
      return [
        { label: 'Transaction', icon: 'diamond', type: 'link', href: '/' },
      ]
    }
  },
}
</script>
