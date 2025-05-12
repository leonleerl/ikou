"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Tabs, TabsContent, TabsList, TabsTrigger,Input,  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export function AuthModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [welcome, setWelcome] = useState<string>("Login")
  const router = useRouter()
  const loginTabRef = useRef<HTMLButtonElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

// Check if user is logged in on component mount
useEffect(() => {
  const checkAuth = async () => {
    try {
      // 首先检查cookie中是否有token
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop()?.split(";").shift();
        }
        return null;
    };

    const token = getCookie("token");
      // 如果有token，尝试从token解析用户信息
      if (token) {
        try {
          // 解析JWT获取用户信息
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          
          const payload = JSON.parse(jsonPayload);
          
          // 如果需要额外验证，可以请求新的API端点
          const response = await fetch(`/api/auth/${payload.id}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setIsLoggedIn(true);
            setWelcome(`Welcome back ${userData.name || 'User'}!`);

            sessionStorage.setItem("userId", userData.id.toString());

          } else {
            // API验证失败，清除无效token
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
          }
        } catch (error) {
          console.error('Error parsing token:', error);
          // 解析错误，清除可能损坏的token
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;';
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };
  
  checkAuth();
}, []);
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Save token to cookie (backend should also set the same cookie)
      document.cookie = `token=${data.token}; path=/; max-age=3600; SameSite=Strict;${process.env.NODE_ENV === 'production' ? ' Secure;' : ''}`;
      
      // Show success message
      toast.success('Login successful')
      // Close dialog
      setOpen(false)
      setWelcome(`Welcome back ${data.user.name}!`)
      setIsLoggedIn(true)
      // Redirect to dashboard
      router.push(`/dashboard/${data.user.id}}`)
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login failed, please try again later')
    } finally {
      setLoading(false)
    }
  }

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Show success message
      toast.success('Registration successful, please login')
      
      // Reset form
      registerForm.reset()
      
      // Switch to login tab
      if (loginTabRef.current) {
        loginTabRef.current.click()
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed, please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear the token cookie with correct syntax
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict;'
    setIsLoggedIn(false)
    setWelcome("Login")
    router.push('/')
    router.refresh()
  }

  return (
    <>
    {!isLoggedIn && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-lg font-semibold text-white hover:text-amber-100">{welcome}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Welcome to Ikou</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to continue your journey
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" ref={loginTabRef}>Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in ..." : 'Sign in'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing up' : 'Sign up'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
    )}
    {isLoggedIn && (

    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <div className="text-lg font-semibold text-white hover:text-amber-100">{welcome}</div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${sessionStorage.getItem('userId') || ''}`} className="w-full">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      
      </DropdownMenuGroup>
    </DropdownMenuContent>
    </DropdownMenu>

    )}
    </>
  )
} 