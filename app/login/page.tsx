"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { toast } from "@/components/ui/use-toast"

// Dynamically import components with SSR disabled
const LoginStars = dynamic(() => import("@/components/login-stars").then(mod => mod.LoginStars), {
  ssr: false
})

const FallingPixels = dynamic(() => import("@/components/falling-pixels").then(mod => mod.FallingPixels), {
  ssr: false
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Login placeholder",
        description: "This is a placeholder login. Real authentication will be added later.",
      })
    }, 1000)
  }
  
  return (
    <div className="min-h-screen bg-[#0D1B33] text-[#F8E8BE] font-pixel overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <LoginStars />
        <FallingPixels />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Login Form */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md space-y-8 bg-[#0A1628]/80 p-8 rounded-lg backdrop-blur-sm border border-[#263A5A]">
          <div className="text-center">
            <h1 className="text-3xl font-pixel text-[#F8E8BE] mb-2">Welcome Back</h1>
            <p className="text-[#F8E8BE]/80">Login to your ARK account</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#F8E8BE]">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="hello@example.com" 
                  className="bg-[#142237] border-[#263A5A] text-[#F8E8BE] focus-visible:ring-[#FFD86E]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#F8E8BE]">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    className="bg-[#142237] border-[#263A5A] text-[#F8E8BE] focus-visible:ring-[#FFD86E] pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F8E8BE]/60 hover:text-[#F8E8BE]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <Link href="/reset-password" className="text-sm text-[#F8E8BE]/80 hover:text-[#FFD86E]">
                Forgot password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
            
            <div className="text-center">
              <p className="text-[#F8E8BE]/80">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#FFD86E] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 