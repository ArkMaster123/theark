"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      setIsSuccess(true)
      toast({
        title: "Welcome aboard TH3 ARK!",
        description: "You've secured your spot on the waitlist. We'll notify you when it's time to embark.",
      })

      // Reset form
      setEmail("")
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="waitlist">
      {!isSuccess ? (
        <motion.form
          onSubmit={handleSubmit}
          className="w-full bg-[#0A1628] p-6 border-2 border-[#F8E8BE] pixel-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F8E8BE] font-pixel">
                Email <span className="text-[#FFD86E]">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel py-3 text-xl transition-all hover:scale-105 pixel-button"
            >
              {isSubmitting ? "Joining..." : "JOIN WAITLIST"}
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          className="w-full bg-[#0A1628] p-6 border-2 border-[#F8E8BE] pixel-border text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-pixel text-[#FFD86E] mb-4">Welcome Aboard!</h3>
          <p className="mb-4">You&apos;ve secured your spot on TH3 ARK waitlist.</p>
          <p className="text-sm text-[#F8E8BE]/70">
            We&apos;ll notify you when it&apos;s time to embark on this magical journey.
          </p>

          <Button
            onClick={() => setIsSuccess(false)}
            className="mt-6 bg-[#5D4777] hover:bg-[#6D57A7] text-[#F8E8BE] font-pixel transition-all hover:scale-105 pixel-button"
          >
            INVITE A FRIEND
          </Button>
        </motion.div>
      )}
    </div>
  )
}
