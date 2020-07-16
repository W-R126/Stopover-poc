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

  static setSessionHeaders(headers: { [key: string]: any }): void {
    SessionManager.sessionId = headers['session-id'];
    SessionManager.tabSessionId = headers['tab-session-id'];
  }

  static getSessionHeaders(): {
    'session-id': string | undefined;
    'tab-session-id': string | undefined;
  } | {} {
    const { sessionId, tabSessionId } = SessionManager;

    if (!(sessionId && tabSessionId)) {
      return {};
    }

    return {
      'session-id': sessionId,
      'tab-session-id': tabSessionId,
    };
  }
}
