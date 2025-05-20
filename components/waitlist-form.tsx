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
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setError(null)
    const webhookUrl = process.env.NEXT_PUBLIC_WAITLIST_WEBHOOK_URL

    if (!webhookUrl) {
      console.error("Waitlist webhook URL is not configured.")
      toast({
        title: "Configuration Error",
        description: "The waitlist system is not properly configured. Please contact support.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        // Make.com webhooks usually return "Accepted" with a 200 status
        // You might want to check response.text() if a specific body is expected for success
        setIsSuccess(true)
        toast({
          title: "Welcome aboard TH3 ARK!",
          description: "You've secured your spot on the waitlist. We'll notify you when it's time to embark.",
        })
        setEmail("") // Reset form
      } else {
        // Handle non-200 responses
        const errorData = await response.text() // Or response.json() if your webhook returns JSON errors
        console.error("Webhook submission error:", response.status, errorData)
        setError(`An error occurred: ${response.status}. Please try again.`)
        toast({
          title: "Submission Failed",
          description: `Could not join the waitlist. Server responded with: ${response.status}. Please try again later.`, // More specific error from response.status
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Network or other error during webhook submission:", err)
      let errorMessage = "An unexpected error occurred. Please check your connection and try again."
      if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      toast({
        title: "Something went wrong",
        description: errorMessage,
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
            {error && (
              <p className="text-sm text-red-500 font-pixel">{error}</p>
            )}
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
            onClick={() => {
              setIsSuccess(false)
              setError(null) // Reset error state if they want to try again or invite friend
            }}
            className="mt-6 bg-[#5D4777] hover:bg-[#6D57A7] text-[#F8E8BE] font-pixel transition-all hover:scale-105 pixel-button"
          >
            JOIN WITH ANOTHER EMAIL
          </Button>
        </motion.div>
      )}
    </div>
  )
}
