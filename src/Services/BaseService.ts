import axios, { AxiosInstance } from 'axios';
import Config from '../Config';

export default abstract class BaseService {
  protected readonly http: AxiosInstance;

  protected readonly pendingRequests: { [key: string]: Promise<any> } = {};

  constructor(config?: Config) {
    this.http = axios.create({
      baseURL: config?.apiBaseURL,
      headers: config?.authToken && { Authorization: `Bearer ${config.authToken}` },
    });
  }

  /**
   * Wraps a request to be reusable in case it's called again during it's execution.
   *
   * @param key Unique key that identifies the request.
   * @param exec Execution body.
   */
  protected async createRequest<T>(
    key: string,
    exec: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    if (this.pendingRequests[key]) {
      return this.pendingRequests[key];
    }

    const pending = exec(...args);

    this.pendingRequests[key] = pending;

    await pending;

    delete this.pendingRequests[key];

    return pending;
  }

  protected getResponseRefs(data?: any): { [key: string]: any } {
    const result: { [key: string]: any } = {};

    if (!data) {
      return result;
    }

    if (data instanceof Array) {
      data.forEach((item) => Object.assign(result, this.getResponseRefs(item)));
    } else if (typeof data === 'object') {
      try {
        if (data['@id']) {
          result[data['@id']] = data;
        }

        Object.keys(data).forEach((key) => {
          Object.assign(result, this.getResponseRefs(data[key]));
        });
      } catch (err) {
        //
      }
    }

    return result;
  }
}
