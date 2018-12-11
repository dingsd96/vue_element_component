const filterObj = {
  test: value => {
    return '过滤后的数据：' + value
  }
}
export default function (filter, value) {
  if (filter) {
    return filterObj[filter](value)
  } else {
    return value
  }
}
