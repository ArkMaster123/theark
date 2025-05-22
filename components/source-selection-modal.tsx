"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import confetti from 'canvas-confetti'

type SourceOption = 
  | "x_twitter" 
  | "linkedin" 
  | "referral" 
  | "ai_jam" 
  | "other"

type SourceSelectionModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (source: string, referralName?: string) => void
}

export function SourceSelectionModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: SourceSelectionModalProps) {
  const [selectedSource, setSelectedSource] = useState<SourceOption | null>(null)
  const [referralName, setReferralName] = useState("")
  const [otherSource, setOtherSource] = useState("")

  // Trigger confetti when AI Jam is selected
  useEffect(() => {
    if (selectedSource === "ai_jam") {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [selectedSource])

  const handleSubmit = () => {
    let sourceValue = selectedSource || ""
    
    if (selectedSource === "referral" && referralName) {
      sourceValue = `referral:${referralName}`
    } else if (selectedSource === "other" && otherSource) {
      sourceValue = `other:${otherSource}`
    }
    
    onSubmit(sourceValue, referralName)
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/80" onClick={onClose}></div>
      <div className="relative z-[101] bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border text-[#F8E8BE] w-[90%] max-w-[425px] p-6 mx-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-[#F8E8BE] hover:text-[#FFD86E]"
        >
          ✕
        </button>
        <div className="mb-4">
          <h2 className="text-xl font-pixel text-[#FFD86E]">
            How did you find us?
          </h2>
          <p className="text-[#F8E8BE]/80">
            Tell us where you heard about TH3 ARK
          </p>
        </div>

        <div className="py-4">
          <RadioGroup 
            value={selectedSource || ""} 
            onValueChange={(value) => setSelectedSource(value as SourceOption)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="x_twitter" value="x_twitter" className="border-[#F8E8BE]"/>
              <Label htmlFor="x_twitter" className="font-pixel cursor-pointer">X / Twitter</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="linkedin" value="linkedin" className="border-[#F8E8BE]"/>
              <Label htmlFor="linkedin" className="font-pixel cursor-pointer">LinkedIn</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="ai_jam" value="ai_jam" className="border-[#F8E8BE]"/>
              <Label htmlFor="ai_jam" className="font-pixel cursor-pointer">The AI Jam</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="referral" value="referral" className="border-[#F8E8BE]"/>
              <Label htmlFor="referral" className="font-pixel cursor-pointer">Referral</Label>
            </div>
            
            {selectedSource === "referral" && (
              <div className="pl-6 pt-1">
                <Label htmlFor="referralName" className="text-sm font-pixel mb-1 block">
                  Who referred you?
                </Label>
                <Input 
                  id="referralName"
                  value={referralName}
                  onChange={(e) => setReferralName(e.target.value)}
                  placeholder="Name of person who referred you"
                  className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="other" value="other" className="border-[#F8E8BE]"/>
              <Label htmlFor="other" className="font-pixel cursor-pointer">Other</Label>
            </div>
            
            {selectedSource === "other" && (
              <div className="pl-6 pt-1">
                <Input 
                  id="otherSource"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  placeholder="Please specify"
                  className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input"
                />
              </div>
            )}
          </RadioGroup>
        </div>

        <div className="mt-4">
          <Button 
            onClick={handleSubmit}
            disabled={!selectedSource || (selectedSource === "referral" && !referralName) || (selectedSource === "other" && !otherSource)}
            className="bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button w-full"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
} 