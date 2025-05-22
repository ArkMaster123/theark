"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

type LegalModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  type: "terms" | "privacy"
}

export function LegalModal({ isOpen, onOpenChange, type }: LegalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A1628]/95 border-2 border-[#263A5A] text-[#F8E8BE] max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel text-[#FFD86E]">
            {type === "terms" ? "Terms of Service" : "Privacy Policy"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {type === "terms" ? (
            <div className="space-y-4 text-sm">
              <p><strong>Last Updated:</strong> 22/05/2025</p>
              
              <p>Welcome to TH3 ARK! These Terms of Service ("Terms") govern your use of our platform and services provided by TH3 ARK LLC ("we," "us," or "our").</p>
              
              <div className="space-y-4">
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">1. Acceptance of Terms</h3>
                  <p>By accessing or using our platform, you agree to be bound by these Terms. If you don't agree, please don't use our services.</p>
                </section>
                
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">2. Description of Service</h3>
                  <p>TH3 ARK is a platform that provides access to AI agents and related services. We may modify, suspend, or discontinue any part of our service at any time.</p>
                </section>
                
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">3. User Accounts</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You must provide accurate information when creating an account</li>
                    <li>You're responsible for maintaining the security of your account</li>
                    <li>You must be at least 13 years old to use our service</li>
                    <li>One person may not maintain multiple accounts</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">4. Acceptable Use</h3>
                  <p>You agree NOT to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Use our service for illegal activities</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Upload malicious code or viruses</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use our service to spam or send unsolicited messages</li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </section>
              </div>
              
              <p className="pt-4">
                <Link href="/terms-of-service" className="text-[#FFD86E] underline hover:text-[#FFE898]">
                  View full Terms of Service
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <p><strong>Last Updated:</strong> 22/05/2025</p>
              
              <p>TH3 ARK LLC ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform and services.</p>
              
              <div className="space-y-4">
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">1. Information We Collect</h3>
                  <h4 className="font-pixel text-[#FFD86E]/80 mb-1">Information You Provide</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Account information (name, email, username)</li>
                    <li>Profile information and preferences</li>
                    <li>Content you create or upload</li>
                    <li>Communications with us or other users</li>
                    <li>Payment information (processed securely by third-party providers)</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">2. How We Use Your Information</h3>
                  <p>We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide and improve our services</li>
                    <li>Create and manage your account</li>
                    <li>Process payments and transactions</li>
                    <li>Communicate with you about our services</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-pixel text-[#FFD86E] mb-2">3. How We Share Your Information</h3>
                  <p>We may share your information with service providers, business partners, and as required by law.</p>
                </section>
              </div>
              
              <p className="pt-4">
                <Link href="/privacy-policy" className="text-[#FFD86E] underline hover:text-[#FFE898]">
                  View full Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 