<template>
  <p class="text-body-1">Посетителей: <span class="text-h6">{{ total }}</span></p>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      total: 0,
      interval: null
    }
  },
  computed: {
    ap_id() {
      return this.$route.query.ap_id
    }
  },
  mounted() {
    this.updateTotal()
    this.interval = setInterval(this.updateTotal, 5000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    updateTotal() {
      this.$api.getTotal({
        access_point: +this.ap_id
      }).then(response => {
        if (response.data.message) {
          console.warn('somethimg went wrong', response.data.message)
        }
        this.total = response.data?.total || this.total
      })
        .catch(() => { })
    }
  }
})
</script>