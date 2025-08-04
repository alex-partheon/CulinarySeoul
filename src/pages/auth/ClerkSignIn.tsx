import React from 'react'
import { CulinarySignIn } from '../../components/auth/enhanced/CulinarySignIn'

const ClerkSignInPage: React.FC = () => {
  return (
    <CulinarySignIn 
      redirectUrl="/dashboard"
      signUpUrl="/sign-up"
    />
  )
}

export default ClerkSignInPage