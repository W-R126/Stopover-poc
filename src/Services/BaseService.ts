import axios, { AxiosInstance } from 'axios';

export default abstract class BaseService {
  protected readonly http: AxiosInstance;

  protected readonly pendingRequests: { [key: string]: Promise<any> } = {};

  constructor(baseURL?: string) {
    this.http = axios.create({
      baseURL,
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
}
