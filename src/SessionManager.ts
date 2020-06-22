import Utils from './Utils';

export default class SessionManager {
  static get sessionId(): string | undefined {
    return Utils.localStore.get('sessionId');
  }

  static set sessionId(value: string | undefined) {
    Utils.localStore.set('sessionId', value);
  }

  static get tabSessionId(): string | undefined {
    return Utils.sessionStore.get('tabSessionId');
  }

  static set tabSessionId(value: string | undefined) {
    Utils.sessionStore.set('tabSessionId', value);
  }
}
