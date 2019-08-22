import { get, remove, set } from 'js-cookie';

const cookieKey = 'umi-token';

// cookie api
export const cookie = {
  getCookie(name?: string) {
    return get(name || cookieKey);
  },
  setCookie(name: string, value: string | object) {
    set(name || cookieKey, value);
  },
  removeCookie(name?: string) {
    remove(name || cookieKey);
  },
};

// sessionStorage api
export const store = {
  get(item) {
    return JSON.parse(window.sessionStorage.getItem(item));
  },
  set(item, val) {
    window.sessionStorage.setItem(item, JSON.stringify(val));
  },
  remove(item) {
    window.sessionStorage.removeItem(item);
  },
  removeAll() {
    window.sessionStorage.clear();
  },
};
