function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export function fmtDate(date,fmt) { //author: meizz   
  var aDate = new Date(date)
  var o = {
    "M+": aDate.getMonth() + 1,                 //月份   
    "d+": aDate.getDate(),                    //日   
    "h+": aDate.getHours(),                   //小时   
    "m+": aDate.getMinutes(),                 //分   
    "s+": aDate.getSeconds(),                 //秒   
    "q+": Math.floor((aDate.getMonth() + 3) / 3), //季度   
    "S": aDate.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (aDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
export default {
  formatNumber,
  formatTime,
  fmtDate
}
