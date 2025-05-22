"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { motion, type Variants } from "framer-motion"
import { SourceSelectionModal } from "@/components/source-selection-modal"

type Intent = 'vibe_coder_agent' | 'navigator' | 'business_partner';

// Define variants outside the component for stable reference
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function WaitlistForm() {
  // Use refs instead of state for input values to avoid re-renders
  const agentEmailRef = useRef<HTMLInputElement>(null);
  const agentNameRef = useRef<HTMLInputElement>(null);
  const navigatorEmailRef = useRef<HTMLInputElement>(null);
  const navigatorNameRef = useRef<HTMLInputElement>(null);
  const businessEmailRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingIntent, setSubmittingIntent] = useState<Intent | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Card flip states
  const [flippedCards, setFlippedCards] = useState<Record<Intent, boolean>>({
    vibe_coder_agent: false,
    navigator: false,
    business_partner: false
  })
  
  // Modal state and temp data storage
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempEmail, setTempEmail] = useState("")
  const [tempIntent, setTempIntent] = useState<Intent | null>(null)
  const [tempCompanyName, setTempCompanyName] = useState("")
  const [tempName, setTempName] = useState("")

  const flipCard = (intent: Intent) => {
    setFlippedCards(prev => ({
      ...prev,
      [intent]: !prev[intent]
    }))
  }

  const openSourceModal = (intent: Intent) => {
    // Get current value from ref
    const email = intent === 'vibe_coder_agent' 
      ? agentEmailRef.current?.value || ""
      : intent === 'navigator'
        ? navigatorEmailRef.current?.value || ""
        : businessEmailRef.current?.value || "";
      
    if (!email) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    
    // Get name for vibe_coder_agent and navigator
    let name = "";
    if (intent === 'vibe_coder_agent') {
      name = agentNameRef.current?.value || "";
      if (!name) {
        toast({ title: "Name Required", description: "Please enter your name.", variant: "destructive" });
        return;
      }
    } else if (intent === 'navigator') {
      name = navigatorNameRef.current?.value || "";
      if (!name) {
        toast({ title: "Name Required", description: "Please enter your name.", variant: "destructive" });
        return;
      }
    }
    
    // For business partners, check company name
    if (intent === 'business_partner') {
      const companyName = companyNameRef.current?.value || "";
      if (!companyName) {
        toast({ title: "Company Name Required", description: "Please enter your company name.", variant: "destructive" });
        return;
      }
      setTempCompanyName(companyName);
    } else {
      setTempCompanyName("");
    }
    
    // Store data temporarily and open modal
    setTempEmail(email)
    setTempIntent(intent)
    setTempName(name)
    setIsModalOpen(true)
  }

  const handleSourceSubmit = async (source: string) => {
    if (!tempEmail || !tempIntent) return;
    
    setIsModalOpen(false)
    setIsSubmitting(true)
    setSubmittingIntent(tempIntent)
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
      setSubmittingIntent(null)
      return
    }

    try {
      const timestamp = new Date().toISOString(); // Add automatic timestamp
      
      // Prepare the payload data
      const payload: Record<string, any> = {
        email: tempEmail, 
        intent: tempIntent, 
        source,
        timestamp, 
        date: timestamp.split('T')[0]
      };
      
      // Add name for vibe_coder_agent and navigator
      if ((tempIntent === 'vibe_coder_agent' || tempIntent === 'navigator') && tempName) {
        payload.name = tempName;
      }
      
      // Add company name for business partners
      if (tempIntent === 'business_partner' && tempCompanyName) {
        payload.companyName = tempCompanyName;
      }
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Welcome aboard TH3 ARK!",
          description: "You've secured your spot. We'll notify you!",
        })
        // Clear input fields after successful submission
        if (agentEmailRef.current) agentEmailRef.current.value = "";
        if (agentNameRef.current) agentNameRef.current.value = "";
        if (navigatorEmailRef.current) navigatorEmailRef.current.value = "";
        if (navigatorNameRef.current) navigatorNameRef.current.value = "";
        if (businessEmailRef.current) businessEmailRef.current.value = "";
        if (companyNameRef.current) companyNameRef.current.value = "";
      } else {
        const errorData = await response.text()
        console.error("Webhook submission error:", response.status, errorData)
        let specificError = "";
        
        if (tempIntent === 'vibe_coder_agent') {
          specificError = `Failed to record your interest as a Vibe Coder Agent. Server: ${response.status}.`;
        } else if (tempIntent === 'navigator') {
          specificError = `Failed to record your interest as a Navigator. Server: ${response.status}.`;
        } else {
          specificError = `Failed to record your interest as a Business Partner. Server: ${response.status}.`;
        }
        
        setError(specificError)
        toast({
          title: "Submission Failed",
          description: specificError + " Please try again later.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Network or other error during webhook submission:", err)
      let errorMessage = "An unexpected error occurred. Please check your connection."
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
      setSubmittingIntent(null)
      setTempEmail("")
      setTempIntent(null)
      setTempCompanyName("")
      setTempName("")
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        id="waitlist"
        className="w-full max-w-lg mx-auto bg-[#0A1628] p-8 border-2 border-[#F8E8BE] pixel-border text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-pixel text-[#FFD86E] mb-4">Welcome Aboard TH3 ARK!</h3>
        <p className="mb-6 text-lg text-[#F8E8BE]/90">
          You&apos;ve chosen your path and your email has been noted. We&apos;ll be in touch soon! 
        </p>
        <Button
          onClick={() => {
            setIsSuccess(false);
            setError(null);
          }}
          className="bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button py-3 px-4 text-md whitespace-normal max-w-[80%] mx-auto"
        >
          Choose Another Path
        </Button>
      </motion.div>
    );
  }

  return (
    <div id="waitlist" className="w-full">
      <h2 className="text-3xl md:text-4xl font-pixel text-[#F8E8BE] mb-10 text-center">Choose Your Journey</h2>
      
      {error && (
        <p className="text-md text-red-500 font-pixel text-center mb-6 bg-[#0A1628] p-3 border border-red-500 pixel-border">{error}</p>
      )}
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Vibe Coder Agent Card */}
        <motion.div
          key="vibe_coder_agent_card"
          className="w-full max-w-[400px] h-[360px] perspective-1000"
          variants={cardVariants}
          transition={{ duration: 0.5 }}
        >
          <div 
            className={`card-flip-container ${
              flippedCards.vibe_coder_agent ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <div className="card-face bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border flex flex-col items-center justify-between p-8 card-pattern-agent">
              <div className="flex-1 flex items-center">
                <h3 className="text-xl font-pixel text-[#FFD86E] text-center leading-tight">Vibe Coder<br/>Agent</h3>
              </div>
              <Button
                type="button"
                onClick={() => flipCard('vibe_coder_agent')}
                className="w-full max-w-[200px] mx-auto font-pixel py-3 px-2 text-xs transition-all hover:scale-105 pixel-button bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] text-center leading-tight"
              >
                Submit Agent
              </Button>
            </div>
            
            {/* Back of card */}
            <div className="card-face card-face-back bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border p-4 card-pattern-agent grid grid-rows-[auto_1fr_auto] h-full">
              <div className="grid-row-start-1">
                <h3 className="text-sm font-pixel text-[#FFD86E] mb-2 text-center">Vibe Coder Agent</h3>
                <p className="text-xs text-[#F8E8BE]/80 mb-4 text-center leading-tight">Got an AI agent idea? Build the future with us.</p>
              </div>
              
              <div className="grid-row-start-2 space-y-3">
                <div>
                  <Label htmlFor="vibe_coder_agent-name" className="text-[#F8E8BE] font-pixel text-xs block mb-1">
                    Name <span className="text-[#FFD86E]">*</span>
                  </Label>
                  <Input
                    id="vibe_coder_agent-name"
                    type="text"
                    placeholder="Your Name"
                    required
                    ref={agentNameRef}
                    className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input text-xs h-8 w-full"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vibe_coder_agent-email" className="text-[#F8E8BE] font-pixel text-xs block mb-1">
                    Email <span className="text-[#FFD86E]">*</span>
                  </Label>
                  <Input
                    id="vibe_coder_agent-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    ref={agentEmailRef}
                    className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input text-xs h-8 w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="grid-row-start-3 space-y-2 self-end">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => openSourceModal('vibe_coder_agent')}
                  className="w-full font-pixel py-2 text-xs transition-all hover:scale-105 pixel-button bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] h-8"
                >
                  {isSubmitting && submittingIntent === 'vibe_coder_agent' ? "Coding..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  onClick={() => flipCard('vibe_coder_agent')}
                  className="w-full font-pixel py-2 text-xs transition-all hover:scale-105 pixel-button bg-transparent border border-[#F8E8BE] text-[#F8E8BE] hover:bg-[#142237] h-8"
                >
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Navigator Card */}
        <motion.div
          key="navigator_card"
          className="w-full max-w-[400px] h-[360px] perspective-1000"
          variants={cardVariants}
          transition={{ duration: 0.5 }}
        >
          <div 
            className={`card-flip-container ${
              flippedCards.navigator ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <div className="card-face bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border flex flex-col items-center justify-between p-8 card-pattern-navigator">
              <div className="flex-1 flex items-center">
                <h3 className="text-xl font-pixel text-[#FFD86E] text-center">Navigator</h3>
              </div>
              <Button
                type="button"
                onClick={() => flipCard('navigator')}
                className="w-full max-w-[200px] mx-auto font-pixel py-3 px-2 text-xs transition-all hover:scale-105 pixel-button bg-[#5D4777] hover:bg-[#6D57A7] text-[#F8E8BE] text-center leading-tight"
              >
                Navigate
              </Button>
            </div>
            
            {/* Back of card */}
            <div className="card-face card-face-back bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border p-4 card-pattern-navigator grid grid-rows-[auto_1fr_auto] h-full">
              <div className="grid-row-start-1">
                <h3 className="text-sm font-pixel text-[#FFD86E] mb-2 text-center">Navigator</h3>
                <p className="text-xs text-[#F8E8BE]/80 mb-4 text-center leading-tight">Ready to explore TH3 ARK? Join early access.</p>
              </div>
              
              <div className="grid-row-start-2 space-y-3 mt-5">
                <div>
                  <Label htmlFor="navigator-name" className="text-[#F8E8BE] font-pixel text-xs block mb-1">
                    Name <span className="text-[#FFD86E]">*</span>
                  </Label>
                  <Input
                    id="navigator-name"
                    type="text"
                    placeholder="Your Name"
                    required
                    ref={navigatorNameRef}
                    className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input text-xs h-8 w-full"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="navigator-email" className="text-[#F8E8BE] font-pixel text-xs block mb-1">
                    Email <span className="text-[#FFD86E]">*</span>
                  </Label>
                  <Input
                    id="navigator-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    ref={navigatorEmailRef}
                    className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input text-xs h-8 w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="grid-row-start-3 space-y-2 self-end">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => openSourceModal('navigator')}
                  className="w-full font-pixel py-2 text-xs transition-all hover:scale-105 pixel-button bg-[#5D4777] hover:bg-[#6D57A7] text-[#F8E8BE] h-8"
                >
                  {isSubmitting && submittingIntent === 'navigator' ? "Charting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  onClick={() => flipCard('navigator')}
                  className="w-full font-pixel py-2 text-xs transition-all hover:scale-105 pixel-button bg-transparent border border-[#F8E8BE] text-[#F8E8BE] hover:bg-[#142237] h-8"
                >
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Business Partner Card */}
        <motion.div
          key="business_partner_card"
          className="w-full max-w-[400px] h-[360px] perspective-1000"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div 
            className={`card-flip-container ${
              flippedCards.business_partner ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <div className="card-face bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border flex flex-col items-center justify-between p-8 card-pattern-business">
              <div className="flex-1 flex items-center">
                <h3 className="text-xl font-pixel text-[#FFD86E] text-center leading-tight">Business<br/>Partner</h3>
              </div>
              <Button
                type="button"
                onClick={() => flipCard('business_partner')}
                className="w-full max-w-[200px] mx-auto font-pixel py-3 px-2 text-xs transition-all hover:scale-105 pixel-button bg-[#247BA0] hover:bg-[#35A1CD] text-[#F8E8BE] text-center leading-tight"
              >
                Partner
              </Button>
            </div>
            
            {/* Back of card */}
            <div className="card-face card-face-back bg-[#0A1628] border-2 border-[#F8E8BE] pixel-border p-4 card-pattern-business grid grid-rows-[auto_1fr_auto] h-full">
              <div className="grid-row-start-1">
                <h3 className="text-sm font-pixel text-[#FFD86E] mb-2 text-center">Business Partner</h3>
                <p className="text-xs text-[#F8E8BE]/80 mb-4 text-center leading-tight">Reach thousands of AI enthusiasts in TH3 ARK.</p>
              </div>
              
              <div className="grid-row-start-2 space-y-3">
                <div>
                  <Label htmlFor="company-name" className="text-[#F8E8BE] font-pixel text-xs block mb-1">
                    Company <span className="text-[#FFD86E]">*</span>
                  </Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Your Company"
                    required
                    ref={companyNameRef}
                    className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input text-xs h-8 w-full"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="business-email" className="text-[#F8E8BE] font-pixel text-xs block mb-1">
                    Email <span className="text-[#FFD86E]">*</span>
                  </Label>
                  <Input
                    id="business-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    ref={businessEmailRef}
                    className="bg-[#0D1B33] border-2 border-[#F8E8BE] text-[#F8E8BE] placeholder:text-[#F8E8BE]/50 font-pixel pixel-input text-xs h-8 w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="grid-row-start-3 space-y-2 self-end">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => openSourceModal('business_partner')}
                  className="w-full font-pixel py-2 text-xs transition-all hover:scale-105 pixel-button bg-[#247BA0] hover:bg-[#35A1CD] text-[#F8E8BE] h-8"
                >
                  {isSubmitting && submittingIntent === 'business_partner' ? "Securing..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  onClick={() => flipCard('business_partner')}
                  className="w-full font-pixel py-2 text-xs transition-all hover:scale-105 pixel-button bg-transparent border border-[#F8E8BE] text-[#F8E8BE] hover:bg-[#142237] h-8"
                >
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Source Selection Modal */}
      <SourceSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSourceSubmit}
      />
    </div>
  );
}
