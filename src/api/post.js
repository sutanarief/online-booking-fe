import axios from 'axios'


const baseUrl = import.meta.env.VITE_BASE_URL

axios.defaults.baseURL = `${baseUrl}`


export default {
  login: (data) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `/user/login`,
        data
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  },
  createEvent: (data) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `/company-event`,
        data
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  }
}