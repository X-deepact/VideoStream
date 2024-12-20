import React from 'react'
import LoginForm from '@/components/auth/LoginForm'

const Login: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center bg-gray-100">
      <LoginForm />
    </div>
  )
}

export default Login
