interface storageObj {
  [key: string]: Function
}

function createStorage(key: string): storageObj {
  let storage: [] = JSON.parse(localStorage.getItem(key)!) || [] 
  return {
    get(): [] {
      return storage || [];
    },

    update(data: []): void {
      localStorage.setItem(key, JSON.stringify(data))
    },
  }
}

export default createStorage