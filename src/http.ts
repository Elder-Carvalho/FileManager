import axios from 'axios'
import store from './store'
import router from './router'

/**
 * Classe wrapper para o axios
 */
class http {
  mode = 'dev'
  lastHeaders = null

  constructor () {
    let service = axios.create({
      baseURL: this.getAPIUrl(),
      timeout: 3000
    })
    service.interceptors.response.use(this.handleSuccess, this.handleError)
    this.service = service
  }

  handleSuccess (response) {
    return response
  }
  
  handleError (error) {
    switch (error.response.status) {
      case 401:
      case 403:
        store.dispatch('auth/logout')
        break
      case 404:
        router.replace('/404')
        break
    }
    return Promise.reject(error)
  }

  getAPIUrl () {
    return this.mode === 'prod' ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
  }

  setToken (sendToken: boolean) {
    if (sendToken) {
      this.service.defaults.headers.common['Authorization'] = store.getters['auth/getUserData'].token
    } else {
      delete this.service.defaults.headers.common['Authorization']
    }
  }

  setHeaders (headers) {
    if (this.lastHeaders !== null) {
      Object.keys(this.lastHeaders).forEach(key => {
        delete this.service.defaults.headers.common[key]
      })
      this.lastHeaders = null
    }
    if (headers !== null) {
      this.lastHeaders = headers
      Object.keys(headers).forEach(key => {
        this.service.defaults.headers.common[key] = headers[key]
      })
    } 
  }

  get (path: string, sendToken = true) {
    this.setToken(sendToken)
    return this.service.get(path)
  }

  post (path: string, payload: object, sendToken = true, headers = null) {
    this.setToken(sendToken)
    this.setHeaders(headers)
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload
    })
  }

  put (path, payload, sendToken = true) {
    this.setToken(sendToken)
    return this.service.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload
    })
  }

  delete (path, sendToken = true) {
    this.setToken(sendToken)
    return this.service.request({
      method: 'DELETE',
      url: path
    })
  }
}

export default new http