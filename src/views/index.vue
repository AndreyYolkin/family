<template>
  <v-list>
    <v-list-subheader>Выберите вход</v-list-subheader>
    <v-list-item v-for="ap_id in [777, 778]" :to="{ path: '/volunteer', query: { ap_id } }" active-color="primary" rounded="xl">
      <v-list-item-title>{{ getAccessPointName(ap_id) }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { useAccessPoint } from '../composables/useAccessPoint';

export default {
  name: 'HomeMain',
  setup() {
    const { getAccessPointName } = useAccessPoint()
    return {
      getAccessPointName
    }
  }
}
</script>
