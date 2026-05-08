import Taro from '@tarojs/taro'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

type HeaderValue = string | number | boolean

type HeadersMap = Record<string, HeaderValue>

type DefaultsHeaders = {
  common: HeadersMap
  get: HeadersMap
  post: HeadersMap
  put: HeadersMap
  patch: HeadersMap
  delete: HeadersMap
  head: HeadersMap
  options: HeadersMap
}

type AxiosLikeDefaults = {
  baseURL: string
  headers: DefaultsHeaders
  timeout?: number
  dataType?: 'json'
  responseType?: 'text' | 'arraybuffer'
}

type AxiosLikeRequestConfig = {
  url?: string
  method?: HttpMethod | Lowercase<HttpMethod>
  baseURL?: string
  params?: Record<string, unknown>
  data?: unknown
  headers?: HeadersMap
  timeout?: number
  dataType?: 'json'
  responseType?: 'text' | 'arraybuffer'
}

type AxiosLikeResponse<T = unknown> = {
  data: T
  status: number
  statusCode: number
  statusText: string
  headers: Record<string, string>
  header: Record<string, string>
  config: Required<Pick<AxiosLikeRequestConfig, 'url' | 'method'>> & AxiosLikeRequestConfig
  requestTask: unknown
}

type AxiosLikeError<T = unknown> = Error & {
  config: AxiosLikeResponse<T>['config']
  response?: AxiosLikeResponse<T>
  requestTask: unknown
  isAxiosError: true
}

const METHOD_NAMES: Lowercase<HttpMethod>[] = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

const METHODS_WITH_PARAMS = new Set<Lowercase<HttpMethod>>(['get', 'delete', 'head', 'options'])

// 每个实例都要有独立的默认 headers，避免互相污染。
function createDefaultsHeaders(): DefaultsHeaders {
  return {
    common: {},
    get: {},
    post: {},
    put: {},
    patch: {},
    delete: {},
    head: {},
    options: {}
  }
}

// 相对路径拼接 baseURL，绝对路径保持原样。
function joinURL(baseURL = '', url = '') {
  if (!baseURL) {
    return url
  }

  if (!url) {
    return baseURL
  }

  if (/^(?:[a-z]+:)?\/\//i.test(url)) {
    return url
  }

  return `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}

function toMethod(method?: HttpMethod | Lowercase<HttpMethod>) {
  return (method || 'GET').toUpperCase() as HttpMethod
}

function createRequestError<T>(
  message: string,
  config: AxiosLikeResponse<T>['config'],
  requestTask: unknown,
  response?: AxiosLikeResponse<T>
) {
  const error = new Error(message) as AxiosLikeError<T>
  error.config = config
  error.response = response
  error.requestTask = requestTask
  error.isAxiosError = true
  return error
}

// 用 Taro.request 提供 axios 风格的调用入口。
class DataSource {
  axios = {
    defaults: {
      baseURL: '',
      headers: createDefaultsHeaders()
    } as AxiosLikeDefaults,
    request: <T = unknown>(config: AxiosLikeRequestConfig) => this.request<T>(config),
    get: <T = unknown>(url: string, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'GET', url }),
    delete: <T = unknown>(url: string, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'DELETE', url }),
    head: <T = unknown>(url: string, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'HEAD', url }),
    options: <T = unknown>(url: string, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'OPTIONS', url }),
    post: <T = unknown>(url: string, data?: unknown, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'POST', url, data }),
    put: <T = unknown>(url: string, data?: unknown, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'PUT', url, data }),
    patch: <T = unknown>(url: string, data?: unknown, config: AxiosLikeRequestConfig = {}) =>
      this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  private request<T = unknown>(config: AxiosLikeRequestConfig): Promise<AxiosLikeResponse<T>> {
    const method = toMethod(config.method)
    const methodKey = method.toLowerCase() as Lowercase<HttpMethod>
    const defaults = this.axios.defaults
    const requestConfig: AxiosLikeResponse<T>['config'] = {
      ...config,
      method,
      url: joinURL(config.baseURL ?? defaults.baseURL, config.url || '')
    }
    const headers = {
      ...defaults.headers.common,
      ...(METHOD_NAMES.includes(methodKey) ? defaults.headers[methodKey] : {}),
      ...(config.headers || {})
    }
    // GET 一类请求把 params 映射到 data，符合 Taro.request 的参数形式。
    const data = METHODS_WITH_PARAMS.has(methodKey) ? (config.params ?? config.data) : config.data

    return new Promise((resolve, reject) => {
      let requestTask: unknown

      requestTask = Taro.request({
        url: requestConfig.url,
        method,
        data,
        header: headers,
        timeout: config.timeout ?? defaults.timeout,
        dataType: config.dataType ?? defaults.dataType,
        responseType: config.responseType ?? defaults.responseType,
        success: (result) => {
          // 成功响应统一包装成 axios 风格结构。
          const response: AxiosLikeResponse<T> = {
            data: result.data as T,
            status: result.statusCode,
            statusCode: result.statusCode,
            statusText: String(result.statusCode),
            headers: result.header,
            header: result.header,
            config: requestConfig,
            requestTask
          }

          if (result.statusCode >= 200 && result.statusCode < 300) {
            resolve(response)
            return
          }

          // 非 2xx 状态码按 axios 习惯走 reject。
          reject(createRequestError(`Request failed with status code ${result.statusCode}`, requestConfig, requestTask, response))
        },
        fail: (error) => {
          reject(
            createRequestError(
              error.errMsg || 'Request failed',
              requestConfig,
              requestTask
            )
          )
        }
      })
    })
  }
}

export default DataSource
