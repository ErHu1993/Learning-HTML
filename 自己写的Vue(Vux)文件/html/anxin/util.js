function getParams () { // eslint-disable-line
  // url获取，变量声明
  var arrURL = window.location.search.substr(1).split("&"), arrParms , key, val, getURL = {} // eslint-disable-line
  // 取值，存入对象
  for (var i = 0; i < arrURL.length; i++) {
    arrParms = arrURL[i].split('=')
    key = arrParms[0]
    val = arrParms[1]
    getURL[key] = val
  }
  return getURL
}
