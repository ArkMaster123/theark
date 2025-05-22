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
import { Checkbox } from "@/components/ui/checkbox"
import { LegalModal } from "@/components/legal-modal"

// Dynamically import components with SSR disabled
const LoginStars = dynamic(() => import("@/components/login-stars").then(mod => mod.LoginStars), {
  ssr: false
})

const FallingPixels = dynamic(() => import("@/components/falling-pixels").then(mod => mod.FallingPixels), {
  ssr: false
})

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false
  })
  const [legalModal, setLegalModal] = useState<{ open: boolean, type: "terms" | "privacy" }>({
    open: false,
    type: "terms"
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeTerms: checked }))
  }
  
  const openLegalModal = (type: "terms" | "privacy") => {
    setLegalModal({ open: true, type })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Account created!",
        description: "Welcome to TH3 ARK. Your journey begins now.",
      })
      // Redirect to login page
      window.location.href = "/login"
    }, 1500)
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
      
      {/* Sign Up Form */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-10">
        <div className="w-full max-w-md space-y-8 bg-[#0A1628]/80 p-8 rounded-lg backdrop-blur-sm border border-[#263A5A]">
          <div className="text-center">
            <h1 className="text-3xl font-pixel text-[#F8E8BE] mb-2">Join TH3 ARK</h1>
            <p className="text-[#F8E8BE]/80">Create your account</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#F8E8BE]">Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  type="text" 
                  placeholder="Your full name" 
                  className="bg-[#142237] border-[#263A5A] text-[#F8E8BE] focus-visible:ring-[#FFD86E]"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            
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
                    placeholder="Create a strong password"
                    className="bg-[#142237] border-[#263A5A] text-[#F8E8BE] focus-visible:ring-[#FFD86E] pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
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
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="data-[state=checked]:bg-[#FFD86E] data-[state=checked]:text-[#0D1B33]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[#F8E8BE]/80 cursor-pointer"
                >
                  I agree to the <button 
                    type="button" 
                    onClick={() => openLegalModal("terms")}
                    className="text-[#FFD86E] hover:underline"
                  >
                    Terms of Service
                  </button> and <button 
                    type="button" 
                    onClick={() => openLegalModal("privacy")}
                    className="text-[#FFD86E] hover:underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
            
            <div className="text-center">
              <p className="text-[#F8E8BE]/80">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FFD86E] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Legal Modal */}
      <LegalModal 
        isOpen={legalModal.open}
        onOpenChange={(open) => setLegalModal(prev => ({ ...prev, open }))}
        type={legalModal.type}
      />
    </div>
  )
} 