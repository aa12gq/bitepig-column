import axios from 'axios'
import store from '@/store'

// axios.defaults.baseURL = ''
// interceptors 发送请求的拦截器
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})

// interceptors 响应的拦截器
axios.interceptors.response.use(resp => {
  store.commit('setLoading', false)
  return resp
})

axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
  console.log(res)
})

export default axios
