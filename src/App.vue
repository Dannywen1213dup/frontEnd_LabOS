<template>
  <a-config-provider>
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
</script>

<style>
#app {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ant Design 定制 */
.ant-layout {
  background: transparent;
}
</style>
