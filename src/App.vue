<template>
  <v-app>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-footer :height="48" style="max-height: 48px;">
      <v-icon class="mr-1" color="primary">mdi-shield</v-icon>Департамент Безопасности ИТМО
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
.v-application {
  font-family: Inter, Roboto, sans-serif !important;
}
</style>