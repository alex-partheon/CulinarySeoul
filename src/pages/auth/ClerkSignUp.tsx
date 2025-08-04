import React from 'react'
import { CulinarySignUp } from '../../components/auth/enhanced/CulinarySignUp'

const ClerkSignUpPage: React.FC = () => {
  return (
    <CulinarySignUp 
      redirectUrl="/onboarding"
      signInUrl="/sign-in"
    />
  )
}

export default ClerkSignUpPage