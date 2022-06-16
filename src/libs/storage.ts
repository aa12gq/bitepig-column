export enum StorageType {
  Local = 'local',
  Session = 'session',
}

export class StorageHandler {
  setItem (type: StorageType, key: string, value:string) {
    if (type === StorageType.Local) {
      localStorage.setItem(key, value)
    } else {
      sessionStorage.setItem(key, value)
    }
  }

  getItem (type: StorageType, key: string) {
    if (type === StorageType.Local) {
      if (localStorage.getItem(key)) {
        return localStorage.getItem(key)
      }
    } else {
      if (sessionStorage.getItem(key)) {
        return sessionStorage.getItem(key)
      }
    }
  }

  remove (type: StorageType, key: string) {
    if (type === StorageType.Local) {
      if (localStorage.getItem(key)) localStorage.removeItem(key)
    } else {
      if (sessionStorage.getItem(key)) sessionStorage.removeItem(key)
    }
  }

  clear (type: StorageType) {
    if (type === StorageType.Local) {
      localStorage.clear()
    } else {
      sessionStorage.clear()
    }
  }
}
