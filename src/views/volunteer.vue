<template>
  <div class="d-flex align-center flex-column">
    <v-btn-toggle v-model="direction" color="primary" dark density="compact" shaped mandatory class="my-4">
      <v-btn :value="2">Вход</v-btn>
      <v-btn :value="1">Выход</v-btn>
    </v-btn-toggle>
    <div class="d-flex align-baseline mb-4">
      <p class="mr-4 text-body-1 font-weight-medium">{{ accessPointName }}</p>
      <total-count />
    </div>
    <qr-reader class="mb-4" @code="lastQR = $event" />
    <p class="mb-4 text-caption d-flex align-center">Последний QR: {{ scannedQR }} <v-btn v-if="scannedQR"
        size="x-small" color="primary" variant="tonal" class="ml-2" @click="resetQR">сбросить</v-btn>
    </p>
    <v-alert :color="alertColor" border="start" class="mb-2">
      <p v-if="response.display === true">
        Отсканируйте ваш QR-код
      </p>
      <p v-else-if="response.allow === false && response.person">{{ response.person.position }}<br />{{
          response.person.surname
      }} {{ response.person.name
}} {{ response.person.patronymic }},<br /> {{ response.message }}!</p>
      <p v-else-if="response.allow === false && !response.person">{{ response.message }}!</p>
      <p v-else-if="response.allow === true">{{ response.person.position }}<br />{{ response.person.surname }} {{
          response.person.name
      }} {{
    response.person.patronymic
}}, <br />{{ response.message }}!</p>
    </v-alert>
    <v-btn v-if="response.allow" color="primary" @click="confirmEntry">
      {{ direction === 2 ? 'Впустить' : 'Выпустить' }}
    </v-btn>
    <v-snackbar v-model="snackbar">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn color="error" text v-bind="attrs" @click="snackbar = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import QrReader from '../components/QrReader.vue';
import TotalCount from '../components/TotalCount.vue';
import { useAccessPoint } from '../composables/useAccessPoint';

export default {
  components: {
    QrReader,
    TotalCount
  },
  setup() {
    const { accessPointName } = useAccessPoint()
    return { accessPointName }
  },
  data() {
    return {
      scannedQR: null,
      lastQR: null,
      lastConfirmedQR: null,
      direction: 2,
      snackbar: false,
      error: '',
      response: {
        display: true,
      },
      timeout: null
    }
  },
  computed: {
    ap_id() {
      return this.$route.query.ap_id
    },
    alertColor() {
      if (this.response.display) {
        return 'primary'
      } else
        if (this.response.allow) {
          return 'success'
        }
        else { return 'error' }
    }
  },
  watch: {
    lastQR() {
      if (this.lastQR) {
        this.scannedQR = this.lastQR
        this.sendQR()
      }
    },
    direction() {
      this.lastQR = null
    }
  },
  methods: {
    resetQR() {
      clearTimeout(this.timeout)
      this.lastQR = null
      this.scannedQR = null
      this.response = { display: true }
    },
    sendQR() {
      clearTimeout(this.timeout)
      this.$api.sendEntry({
        direction: this.direction,
        access_point: +this.ap_id,
        key_hex: this.lastQR
      }).then((response) => {
        this.response = response.data
        this.lastConfirmedQR = this.lastQR
        if (!response.data.allow) {
          this.timeout = setTimeout(() => { this.response = { display: true } }, 7000)
        }
      })
        .catch((err) => {
          this.error = error.response.data.message || error.response.data
          this.snackbar = true
        })
    },
    confirmEntry() {
      if (this.response.allow) {
        this.$api.confirmEntry({
          direction: this.direction,
          access_point: +this.ap_id,
          key_hex: this.lastConfirmedQR
        }).then((response) => {
          clearTimeout(this.timeout)
          this.error = response.data.message || response.data
          this.snackbar = true
          this.timeout = setTimeout(() => { this.response = { display: true } }, 7000)
        })
          .catch((error) => {
            this.error = error.response.data.message || error.response.data
            this.snackbar = true
          })
      }
    }
  }
}
</script>