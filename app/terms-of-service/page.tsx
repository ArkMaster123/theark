"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"

// Dynamically import components with SSR disabled
const LoginStars = dynamic(() => import("@/components/login-stars").then(mod => mod.LoginStars), {
  ssr: false
})

const FallingPixels = dynamic(() => import("@/components/falling-pixels").then(mod => mod.FallingPixels), {
  ssr: false
})

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0D1B33] text-[#F8E8BE] font-readable overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <LoginStars />
        <FallingPixels />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Terms of Service Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl bg-[#0A1628]/80 p-8 rounded-lg backdrop-blur-sm border border-[#263A5A]">
          <h1 className="text-3xl md:text-4xl font-pixel text-[#FFD86E] mb-8 text-center">Terms of Service</h1>
          
          <div className="text-sm md:text-base space-y-6 text-[#F8E8BE]/90">
            <p className="mb-4"><strong>Last Updated:</strong> 22/05/2025</p>
            
            <p>Welcome to TH3 ARK! These Terms of Service ("Terms") govern your use of our platform and services provided by TH3 ARK LLC ("we," "us," or "our").</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using our platform, you agree to be bound by these Terms. If you don't agree, please don't use our services.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">2. Description of Service</h2>
                <p>TH3 ARK is a platform that provides access to AI agents and related services. We may modify, suspend, or discontinue any part of our service at any time.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">3. User Accounts</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You must provide accurate information when creating an account</li>
                  <li>You're responsible for maintaining the security of your account</li>
                  <li>You must be at least 13 years old to use our service</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">4. Acceptable Use</h2>
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
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">5. Content and Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You retain ownership of content you create</li>
                  <li>By using our platform, you grant us a license to use, display, and distribute your content as necessary to provide our service</li>
                  <li>You must not infringe on others' intellectual property rights</li>
                  <li>We respect intellectual property and will respond to valid takedown requests</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">6. Privacy</h2>
                <p>Your privacy is important to us. Our <Link href="/privacy-policy" className="text-[#FFD86E] underline hover:text-[#FFE898]">Privacy Policy</Link> explains how we collect and use your information.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">7. Payments and Refunds</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All fees are non-refundable unless required by law</li>
                  <li>We may change our pricing with 30 days notice</li>
                  <li>You're responsible for all charges incurred under your account</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">8. Termination</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You may delete your account at any time</li>
                  <li>We may suspend or terminate accounts that violate these Terms</li>
                  <li>Upon termination, you lose access to our service</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">9. Disclaimers</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Our service is provided "as is" without warranties</li>
                  <li>We don't guarantee uninterrupted or error-free service</li>
                  <li>AI agents may produce inaccurate or inappropriate content</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">10. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, TH3 ARK LLC shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">11. Indemnification</h2>
                <p>You agree to defend and hold harmless TH3 ARK LLC from any claims arising from your use of our service or violation of these Terms.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">12. Governing Law</h2>
                <p>These Terms are governed by the laws of [Your State/Country]. Any disputes will be resolved in the courts of [Your Jurisdiction].</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">13. Changes to Terms</h2>
                <p>We may update these Terms from time to time. We'll notify users of significant changes via email or platform notification.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">14. Contact Information</h2>
                <p>If you have questions about these Terms, contact us at:</p>
                <ul className="list-none pl-6 space-y-1">
                  <li>Email: [your-email@th3ark.com]</li>
                  <li>Address: [Your Business Address]</li>
                </ul>
              </section>
            </div>
            
            <div className="mt-12 pt-8 border-t border-[#263A5A] text-center">
              <p className="text-lg font-pixel text-[#FFD86E]">TH3 ARK LLC</p>
              <p className="text-sm italic">Making AI Agents Accessible to Everyone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 