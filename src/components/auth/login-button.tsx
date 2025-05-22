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
            // setIsLoading(false);
        }
    }

  return (
    <Button 
      onClick={handleSignIn} 
      disabled={isLoading}
      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium px-5 transition-all duration-300 hover:shadow-md"
    >
      {isLoading ? (
        <>
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
          Loading...
        </>
      ) : "Sign in"}
    </Button>
  )
}

export default LoginButton
