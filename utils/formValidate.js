// rule验证
// 验证通过返回'',不通过返回错误信息msg
export function ruleValidate(value, label, rule) {
  let result = {
    msg: '',
    status: 2
  }

  let { type, reg, msg } = rule;
  switch (type) {
    case 'null':
      result.status = 0
      result.msg = ""
      break
    case 'notnull':
      if (value instanceof Array ? value.length == 0 : !value) {
        result.msg = msg ? msg : label + '未填写';
        result.status = 3
      } else {
        result.msg = ""
      }
      break
    case 'reg':
      reg = new RegExp(reg)
      if (!reg.test(value)) {
        result.msg = msg ? msg : item.label + '不合法，请重新输入';
        result.status = 3
      } else {
        result.msg = ''
      }
      break
    case 'count':
      let { amount } = rule
      if (value.length < amount) {
        result.msg = msg ? msg : label + '未达到要求';
        result.status = 3
      } else {
        result.msg = ""
      }
      break
  }
  return result
}
