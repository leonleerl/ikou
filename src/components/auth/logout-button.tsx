import { signOut } from 'next-auth/react';
import { Button } from '../ui'
import React, { useState } from 'react'

function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = async () => {
        try{
            setIsLoading(true);
            await signOut(
                {
                    callbackUrl: "/",
                    redirect: true,
                }
            );  
        }
        catch(error){
            console.log(error);
        } 
        finally{
            setIsLoading(false);
        }
    }
    return (
      <Button 
        onClick={handleLogout} 
        disabled={isLoading}
        variant="outline"
        className="border-amber-300 text-amber-800 hover:bg-amber-50 transition-all duration-300 hover:shadow-sm font-medium"
      >
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
            Loading...
          </>
        ) : "Logout"}
      </Button>
    )
}

export default LogoutButton
