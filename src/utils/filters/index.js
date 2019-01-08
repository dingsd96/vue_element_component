const filterObj = {

  // 表格中type的过滤函数
  tableType: value => {
    if (value === 1) {
      return '有效'
    } else {
      return '无效'
    }
  }
}

export default function (filter, value) {
  if (filter) {
    return filterObj[filter](value)
  } else {
    return value
  }
}
