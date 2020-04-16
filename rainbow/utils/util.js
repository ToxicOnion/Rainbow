const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth()+1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const timeSearch = date => {
  const year = date.getFullYear()
  const month = date.getMonth()+1
  const day = date.getDate()
  const hour = date.getHours()>13?14:8
  const minute = 0
  const second = 0
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  timeSearch:timeSearch
}
