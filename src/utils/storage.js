/**
 * 本地存储封装模块
 */
export const getStorageItem = (name) => {
  const data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setStorageItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeStorageItem = (name) => {
  window.localStorage.removeItem(name)
}
