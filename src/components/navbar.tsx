"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { AuthModal } from "@/components/auth"
import { NavigationMenuLink } from "@/components/ui"

export function Navbar() {
  return (
    <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 ml-6">
          <Image src="/images/robot.jpg" alt="logo" width={40} height={40} className="rounded-full"/>
            <h1 className="text-2xl font-bold">Ikou</h1>
        </Link>
      <div className="flex items-center gap-6 mr-6">
        <Link href={"/dashboard"} className="text-lg font-semibold text-white hover:text-amber-100">Dashboard</Link>
        <AuthModal />
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
