import axios from 'axios'


const baseUrl = import.meta.env.VITE_BASE_URL

axios.defaults.baseURL = `${baseUrl}`


export default {
  updateStatus: (data, companyEventId) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'PATCH',
        url: `/company-event/${companyEventId}`,
        data
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  }
}