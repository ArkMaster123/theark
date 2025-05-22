"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft } from "lucide-react"
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

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      toast({
        title: "Reset link sent!",
        description: "If your email exists in our system, you'll receive a password reset link.",
      })
    }, 1000)
  }
  
  return (
    <div className="min-h-screen bg-[#0D1B33] text-[#F8E8BE] font-readable overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <LoginStars />
        <FallingPixels />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Reset Password Form */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md space-y-8 bg-[#0A1628]/80 p-8 rounded-lg backdrop-blur-sm border border-[#263A5A]">
          <div className="text-center">
            <h1 className="text-3xl font-pixel text-[#F8E8BE] mb-2">Reset Password</h1>
            <p className="text-[#F8E8BE]/80">Enter your email to receive a reset link</p>
          </div>
          
          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-[#142237] p-4 rounded-lg border border-[#263A5A] text-center">
                <p className="text-[#F8E8BE] mb-2">Check your inbox!</p>
                <p className="text-[#F8E8BE]/80 text-sm">
                  We've sent instructions to reset your password. Please check your email.
                </p>
              </div>
              
              <Button 
                className="w-full bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button"
                onClick={() => setIsSuccess(false)}
              >
                Send Again
              </Button>
              
              <div className="text-center">
                <Link href="/login" className="text-[#FFD86E] hover:underline inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#F8E8BE]">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="hello@example.com" 
                    className="bg-[#142237] border-[#263A5A] text-[#F8E8BE] focus-visible:ring-[#FFD86E]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <div className="text-center">
                <Link href="/login" className="text-[#FFD86E] hover:underline inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 