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
    <div>
      <Button onClick={handleLogout} disabled={isLoading}>Logout</Button>
    </div>
  )
}

export default LogoutButton
