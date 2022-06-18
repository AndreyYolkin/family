<template>
  <v-card max-width="400">
    <v-card-text>
      <v-responsive :aspect-ratio="1">
        <qr-stream @decode="onDecode" :camera="camera" @init="onInit" class="mb">
          <div style="color: #b00b69;" class="frame"></div>
          <v-btn @click="switchCamera()" class="mt-3 ml-3" size="small" icon="mdi-camera-flip" />
          <div v-show="showScanConfirmation" class="text-center text-body-1">
            <span>Секундочку...</span>
          </div>
        </qr-stream>
      </v-responsive>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent } from 'vue';
import { QrStream } from 'vue3-qr-reader';
export default defineComponent({
  name: 'QrCaptureExample',
  components: {
    QrStream,
  },
  data() {
    return {
      camera: 'auto',
      lastCamera: 'auto',
      showScanConfirmation: false,
      error: '',
      noCamera: {
        front: false,
        auto: false
      }
    }
  },
  mounted() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(() => {
        this.switchCamera()
        this.$nextTick().then(() => {
          this.switchCamera()
        })
      })
      .catch(() => {
        // TODO: handle the error
      });
  },
  methods: {
    async onDecode(data) {
      this.$emit('code', data)

      this.pause()
      await this.timeout(300)
      this.unpause()
    },
    unpause() {
      this.camera = this.lastCamera
    },
    pause() {
      this.lastCamera = this.camera
      this.camera = 'off'
    },

    timeout(ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    },
    switchCamera() {
      this.camera = { front: 'auto', auto: 'front' }[this.camera]
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        const triedFrontCamera = this.camera === 'front'
        const triedAutoCamera = this.camera === 'auto'

        const cameraMissingError = error.name === 'OverconstrainedError'

        if (triedAutoCamera && cameraMissingError) {
          this.noCamera.auto = true
        }
        if (triedFrontCamera && cameraMissingError) {
          this.noCamera.front = true
        }
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permission"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        } else if (error.name === 'InsecureContextError') {
          this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      } finally {
        this.showScanConfirmation = this.camera === 'off'
      }
    },
  }
});
</script>

<style>
.qr-stream-wrapper,
.qr-stream-camera {
  aspect-ratio: 1;
}
</style>