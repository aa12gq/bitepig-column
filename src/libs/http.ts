import axios, { AxiosRequestConfig } from 'axios'
import store from '@/store'

// axios.defaults.baseURL = ''
// interceptors 发送请求的拦截器
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})

// interceptors 响应的拦截器
axios.interceptors.response.use(resp => {
  store.commit('setLoading', false)
  return resp
}, e => {
  console.log(e.response)
  const error = e.response.data.message
  store.commit('setError', { status: true, message: '请检查输入是否正确' })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

// axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
//   console.log(res)
// })

export { axios, AxiosRequestConfig }
