import Axios from 'axios'

let api = Axios.create()

api.defaults.baseURL = '/apis/'

export default api
