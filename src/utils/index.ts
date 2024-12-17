import axios, { InternalAxiosRequestConfig } from 'axios'

class ApiService {
  private static baseURL = 'http://127.0.0.1:8000'; // 设置基础 URL
  private static timeout = 5000; // 设置请求超时
  private static headers: {
    'Content-Type': 'application/x-www-form-urlencoded', // 避免触发预检
  };

  // 默认的 axios 实例
  private static apiClient = axios.create({
    baseURL: ApiService.baseURL,
    timeout: ApiService.timeout
  });

  // 可选的请求拦截器：如果需要添加 token 或其他头信息
  private static addRequestInterceptor () {
    this.apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => { // 使用 InternalAxiosRequestConfig
        // 在这里可以处理请求前的逻辑，比如添加 Authorization 头
        const token = localStorage.getItem('authToken')
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  // 可选的响应拦截器：根据需要处理响应
  private static addResponseInterceptor () {
    this.apiClient.interceptors.response.use(
      (response) => {
        // 可以在这里处理响应数据（如统一格式化）
        return response
      },
      (error) => {
        // 根据需要处理错误
        console.error('API request error:', error)
        return Promise.reject(error)
      }
    )
  }

  // 初始化拦截器（如果有）
  static initialize () {
    this.addRequestInterceptor()
    this.addResponseInterceptor()
  }

  // GET 请求
  // static async get<T> (url: string): Promise<T> {
  //   try {
  //     const response = await this.apiClient.get<T>(url)
  //     return response.data
  //   } catch (error) {
  //     console.error(`Error fetching data from ${url}:`, error)
  //     throw error
  //   }
  // }

  // GET 请求
  static async get<T> (url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.apiClient.get<T>(url, { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error)
      throw error
    }
  }

  // POST 请求
  static async post<T, U = Record<string, unknown>> (url: string, body: U): Promise<T> {
    try {
      const response = await this.apiClient.post<T>(url, body)
      return response.data
    } catch (error) {
      console.error(`Error posting data to ${url}:`, error)
      throw error
    }
  }

  // PUT 请求
  static async put<T, U = Record<string, unknown>> (url: string, body: U): Promise<T> {
    try {
      const response = await this.apiClient.put<T>(url, body)
      return response.data
    } catch (error) {
      console.error(`Error updating data at ${url}:`, error)
      throw error
    }
  }

  // DELETE 请求
  static async delete<T> (url: string): Promise<T> {
    try {
      const response = await this.apiClient.delete<T>(url)
      return response.data
    } catch (error) {
      console.error(`Error deleting data at ${url}:`, error)
      throw error
    }
  }
}

export default ApiService
