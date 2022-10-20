const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = ''
  const { SECRET } = process.env

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodeToken = {}

  try {
    decodeToken = jwt.verify(token, SECRET)
  } catch (error) {
    next(error)
  }

  if (!token || !decodeToken.id) {
    return response.status(401).json({ error: 'token mising or invalid' })
  }

  const { id: userId } = decodeToken

  request.userId = userId

  next()
}
