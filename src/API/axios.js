// 请求模块
import axios from 'axios'
// 配置请求超时
axios.create({
    timeout: 3000
})


// 请求拦截
axios.interceptors.request.use(config => {
    // token
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 响应拦截
axios.interceptors.response.use(config => {
    return config
})
export default axios