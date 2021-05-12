import axios, { AxiosRequestConfig } from 'axios';

export function requestRetry(options: AxiosRequestConfig, retry: number = 2) {
  return axios.request(options)
    .then(res => {
      if (res.status < 400) return res;
      if (retry > 0) {
        console.log(retry)
        return requestRetry(options, retry - 1);
      }
      else {
        console.log('nono')
        throw new Error('Request Error');
      }
    })
}