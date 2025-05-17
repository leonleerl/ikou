"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { lazy, Suspense } from 'react'
import { useSession } from "next-auth/react"
import { Button } from "@radix-ui/themes"
import { useRouter } from "next/navigation"

import { NavigationMenuLink } from "@/components/ui"

const LoginButton = lazy(() => import("./auth/login-button"));
const LogoutButton = lazy(() => import("./auth/logout-button"));

export function Navbar() {

  const {data: session, status} = useSession();
  const router = useRouter();

  const handleDashboard = (id: string) => {
    if (id) {
      router.push(`/dashboard/${id}`);
    } else {
      console.error("User ID is undefined");
    }
  }

  return (
    <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 ml-6">
          <Image src="/images/robot.jpg" alt="logo" width={40} height={40} className="rounded-full"/>
            <h1 className="text-2xl font-bold">Ikou</h1>
        </Link>
      <div className="flex items-center gap-6 mr-6">
      {/* if not logged in, show login button */}
      {status === "unauthenticated" && (
        <Suspense>
          <LoginButton />
        </Suspense>
      )}
      {/* if logged in, show logout button, welcome message and user image */}
      {status === "authenticated" && (
        <>
          <Button variant="outline" onClick={() => handleDashboard(session?.user?.id)}>Dashboard</Button>
          <Suspense>
            <LogoutButton />
          </Suspense>
          <p>Welcome, {session?.user?.name}</p>
          <Image src={session?.user?.image || ""} alt="user image" width={32} height={32} className="rounded-full border-2 border-black" />
        </>
      )}
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
