"use client"

import React from 'react'
import { Button } from '../ui'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

function LoginButton() {

    const [isLoading, setIsLoading] = useState(false);
    const handleSignIn = async () => {
        try{
            setIsLoading(true);
            await signIn("google", {
                email: "test@test.com",
                password: "test",
                redirect: false,
                callbackUrl: "/",
            })
        }
        catch(error){
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
    }

  return (
    <div>
      <Button onClick={handleSignIn} disabled={isLoading}>Sign in</Button>
    </div>
  )
}

export default LoginButton
