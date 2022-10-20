import React from 'react'
import Toggable from './Togglable'
import PropTypes from 'prop-types'

export default function LoginForm({
  username,
  password,
  handleUserNameChange,
  handlePasswordNameChange,
  handleSubmit
}) {
  return (
    <Toggable buttonLabel='Show login'>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            value={username}
            name='username'
            placeholder='Username'
            onChange={handleUserNameChange}
          />
        </div>
        <div>
          <input
            type='password'
            value={password}
            name='password'
            placeholder='Password'
            onChange={handlePasswordNameChange}
          />
        </div>
        <button id='form-login-button'>Login</button>
      </form>
    </Toggable>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUserNameChange: PropTypes.func.isRequired,
  handlePasswordNameChange: PropTypes.func.isRequired
}
