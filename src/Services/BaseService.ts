import axios, { AxiosInstance } from 'axios';

export default abstract class BaseService {
  protected readonly http: AxiosInstance;

  constructor(baseURL?: string) {
    this.http = axios.create({
      baseURL,
      withCredentials: true,
    });
  }
}
