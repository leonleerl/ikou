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
    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-white to-amber-50 shadow-sm top-0 z-50 transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
          <div className="relative overflow-hidden rounded-full border-2 border-amber-300 shadow-sm">
            <Image src="/images/robot.jpg" alt="logo" width={40} height={40} className="rounded-full hover:scale-110 transition-all duration-300"/>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">Ikou</h1>
        </Link>
      <div className="flex items-center gap-6">
      {/* if not logged in, show login button */}
      {status === "unauthenticated" && (
        <Suspense fallback={<div className="w-24 h-10 animate-pulse bg-gray-200 rounded-md"></div>}>
          <LoginButton />
        </Suspense>
      )}
      {/* if logged in, show logout button, welcome message and user image */}
      {status === "authenticated" && (
        <div className="flex items-center gap-5">
          <Button 
            variant="outline" 
            onClick={() => handleDashboard(session?.user?.id)}
            className="transition-all duration-300 hover:bg-amber-50 hover:border-amber-300 hover:shadow-sm"
          >
            Dashboard
          </Button>
          <Suspense fallback={<div className="w-24 h-10 animate-pulse bg-gray-200 rounded-md"></div>}>
            <LogoutButton />
          </Suspense>
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 py-1.5 px-3 rounded-full shadow-sm">
            <p className="font-medium text-amber-900">Welcome, <span className="text-amber-700">{session?.user?.name}</span></p>
            <div className="relative overflow-hidden rounded-full border-2 border-amber-300">
              <Image src={session?.user?.image || ""} alt="user image" width={32} height={32} className="rounded-full hover:scale-110 transition-all duration-300" />
            </div>
          </div>
        </div>
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
