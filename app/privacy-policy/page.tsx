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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D1B33] text-[#F8E8BE] font-pixel overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <LoginStars />
        <FallingPixels />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Privacy Policy Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl bg-[#0A1628]/80 p-8 rounded-lg backdrop-blur-sm border border-[#263A5A]">
          <h1 className="text-3xl md:text-4xl font-pixel text-[#FFD86E] mb-8 text-center">Privacy Policy</h1>
          
          <div className="text-sm md:text-base space-y-6 text-[#F8E8BE]/90">
            <p className="mb-4"><strong>Last Updated:</strong> 22/05/2025</p>
            
            <p>TH3 ARK LLC ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform and services.</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">1. Information We Collect</h2>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mb-2">Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Account information (name, email, username)</li>
                  <li>Profile information and preferences</li>
                  <li>Content you create or upload</li>
                  <li>Communications with us or other users</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                </ul>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Usage data (how you interact with our platform)</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>Log data (IP address, access times, pages viewed)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Social media login information (if you choose to connect accounts)</li>
                  <li>AI agent data from business partners</li>
                  <li>Analytics data from service providers</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide and improve our services</li>
                  <li>Create and manage your account</li>
                  <li>Process payments and transactions</li>
                  <li>Communicate with you about our services</li>
                  <li>Personalize your experience</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Develop new features and services</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">3. How We Share Your Information</h2>
                <p>We may share your information with:</p>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">Service Providers</h3>
                <p>Third-party companies that help us operate our platform (hosting, analytics, payment processing)</p>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">Business Partners</h3>
                <p>AI agent developers and businesses whose services you choose to interact with</p>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">Legal Requirements</h3>
                <p>When required by law, court order, or to protect our rights and safety</p>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">Business Transfers</h3>
                <p>In connection with a merger, acquisition, or sale of assets</p>
                
                <p className="mt-4">We do NOT sell your personal information to third parties.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">4. Data Security</h2>
                <p>We implement appropriate security measures to protect your information, including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Encryption of sensitive data</li>
                  <li>Secure server infrastructure</li>
                  <li>Regular security audits</li>
                  <li>Access controls and authentication</li>
                </ul>
                <p className="mt-2">However, no method of transmission over the internet is 100% secure.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">5. Your Rights and Choices</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Control cookie preferences</li>
                  <li>Request data portability (where applicable)</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">6. Cookies and Tracking</h2>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Remember your preferences</li>
                  <li>Analyze platform usage</li>
                  <li>Provide personalized content</li>
                  <li>Ensure security</li>
                </ul>
                <p className="mt-2">You can control cookie settings through your browser, but some features may not work properly if cookies are disabled.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">7. Third-Party Links and Services</h2>
                <p>Our platform may contain links to third-party websites or integrate with external services. This Privacy Policy does not apply to those third parties. Please review their privacy policies.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">8. Children's Privacy</h2>
                <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">9. International Data Transfers</h2>
                <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">10. Data Retention</h2>
                <p>We retain your information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">11. AI and Machine Learning</h2>
                <p>We may use AI and machine learning technologies to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Improve our services</li>
                  <li>Personalize user experiences</li>
                  <li>Analyze usage patterns</li>
                  <li>Detect and prevent fraud</li>
                </ul>
                <p className="mt-2">These processes are designed to protect user privacy while enhancing platform functionality.</p>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">12. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify users of material changes via:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email notification</li>
                  <li>Platform announcement</li>
                  <li>Updated "Last Updated" date</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">13. Contact Us</h2>
                <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
                <ul className="list-none pl-6 space-y-1">
                  <li>Email: [privacy@th3ark.com]</li>
                  <li>Address: [Your Business Address]</li>
                  <li>Data Protection Officer: [If applicable]</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl md:text-2xl font-pixel text-[#FFD86E] mb-3">14. State-Specific Rights</h2>
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mb-2">California Residents (CCPA)</h3>
                <p>California residents have additional rights including the right to know what personal information we collect and how it's used, and the right to delete personal information.</p>
                
                <h3 className="text-lg font-pixel text-[#FFD86E]/80 mt-4 mb-2">European Residents (GDPR)</h3>
                <p>European residents have rights including access, rectification, erasure, and data portability. You also have the right to object to processing and withdraw consent.</p>
              </section>
            </div>
            
            <div className="mt-12 pt-8 border-t border-[#263A5A] text-center">
              <p className="text-lg font-pixel text-[#FFD86E]">TH3 ARK LLC</p>
              <p className="text-sm italic">Your Privacy, Our Priority</p>
              <p className="mt-4">
                <Link href="/terms-of-service" className="text-[#FFD86E] underline hover:text-[#FFE898]">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 