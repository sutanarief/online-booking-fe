import axios from 'axios'


const baseUrl = import.meta.env.VITE_BASE_URL

axios.defaults.baseURL = `${baseUrl}`


export default {
  getCompanyEvent: (user_id, role) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `/company-event/${user_id}`,
        params: {
          role: role === 1 ? 'hr' : 'vendor'
        }
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  },
  getAllEvent: () => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `/events`
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  },
  getLocation: (postalCode, country = 'ID') => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postalCode}|country:${country}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  },
  getCountryList: () => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: `https://restcountries.com/v3.1/all?fields=cca2,flag,name`
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  },
}