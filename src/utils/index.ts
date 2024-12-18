import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

class ApiService {
  private static baseURL = 'http://127.0.0.1:8000'
  private static timeout = 5000

  // 默认的 axios 实例
  private static apiClient = axios.create({
    baseURL: ApiService.baseURL,
    timeout: ApiService.timeout
  })

  // 请求拦截器：自动为非 login 接口添加 token
  private static addRequestInterceptor () {
    this.apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken')
        if (token && !config.url?.includes('/login')) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  // 响应拦截器：统一处理错误或未授权状态
  private static addResponseInterceptor () {
    this.apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized, redirecting to login...')
          localStorage.removeItem('authToken') // 清理 token
          localStorage.removeItem('currentUser') // 清理 token
          window.location.href = '/login'
        } else {
          console.error('API request error:', error.message || error)
        }
        return Promise.reject(error)
      }
    )
  }

  // 初始化拦截器
  static initialize () {
    this.addRequestInterceptor()
    this.addResponseInterceptor()
  }

  // GET 请求
  static async get<T> (url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.apiClient.get<T>(url, { params })
    return response.data
  }

  // POST 请求
  static async post<T, U = Record<string, unknown>> (url: string, body: U): Promise<T> {
    const response = await this.apiClient.post<T>(url, body)
    return response.data
  }

  // PUT 请求
  static async put<T, U = Record<string, unknown>> (url: string, body: U): Promise<T> {
    const response = await this.apiClient.put<T>(url, body)
    return response.data
  }

  // DELETE 请求
  static async delete<T> (url: string): Promise<T> {
    const response = await this.apiClient.delete<T>(url)
    return response.data
  }
}

// 初始化拦截器
ApiService.initialize()

export default ApiService
