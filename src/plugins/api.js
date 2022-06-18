import axios from "axios";

console.log(import.meta.env)

axios.defaults.headers.Authorization = import.meta.env.VITE_AUTH_KEY
axios.defaults.baseURL = import.meta.env.VITE_API_URL


const api = {
  getTotal(data) {
    return axios.request({ method: 'post', url: '/total/', data })
  },
  sendEntry(data) {
    return axios.request({ method: 'post', url: '/check-in/', data })
  },
  confirmEntry(data) {
    return axios.request({ method: 'post', url: '/check-in/delivery/', data })
  }
}

export default {
    install: (app) => {
        app.config.globalProperties.$api = api
    }
}