import axios from 'axios'

// axios.defaults.baseURL = ''
// interceptors 发送请求的拦截器
axios.interceptors.request.use(config => {
  config.params = {
    ...config.params
  }
  return config
})

axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
  console.log(res)
})

export default axios
