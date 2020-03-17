module.exports = options => {
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../modules/AdminUser')

  return async (req, res, next) => {
    // 校验用户是否登录
    console.log(req.headers)
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请提供jwt token, 请先登录')
    const {
      id
    } = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '无效的jwt token, 请先登录')
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '用户不存在')
    await next()
  }
}