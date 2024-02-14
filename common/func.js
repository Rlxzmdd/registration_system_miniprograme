const promisify = name => options =>
  new Promise((resolve, reject) => {
    wx[name]({
      ...options,
      success: (res) => {
        if (options.duration)
          setTimeout(() => {
            resolve(res)
          }, options.duration)
        else
          resolve(res)
      },
      fail: err => reject(err)
    })
  })

export function showToast(options) {
  const toast = promisify('showToast')
  if (!options.icon)
    options.icon = 'none'

  return toast(options)
}

export function showModal(options) {
  const modal = promisify('showModal')
  if (!options.showCancel)
    options.showCancel = false

  return modal(options)
}