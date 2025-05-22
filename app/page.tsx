"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { WaitlistForm } from "@/components/waitlist-form"
import { PixelatedCharacters } from "@/components/pixelated-characters"
import { GlowingWindows } from "@/components/glowing-windows"
import { Header } from "@/components/header"
import { AboutSection } from "@/components/about-section"
import { AboutUsSection } from "@/components/about-us-section"
import { InteractiveFeatures } from "@/components/interactive-features"
import Link from "next/link"

// Dynamically import components with SSR disabled
const PixelatedStars = dynamic(() => import("@/components/pixelated-stars").then(mod => mod.PixelatedStars), {
  ssr: false
})

const FallingPixels = dynamic(() => import("@/components/falling-pixels").then(mod => mod.FallingPixels), {
  ssr: false
})

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D1B33] text-[#F8E8BE] font-readable overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <PixelatedStars />
        <FallingPixels />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          {/* Main pixel art image with animated overlays */}
          <div className="relative w-full aspect-[1/1.2] max-w-3xl mx-auto mb-8">
            <Image
              src="/images/the-ark-full.png"
              alt="TH3 ARK - Noah's Home for AI Agents"
              fill
              priority
              className="object-contain pixelated"
            />

            {/* Animated overlays */}
            <GlowingWindows />
            <PixelatedCharacters />
          </div>

          {/* Space for additional content if needed */}
          <div className="mb-12"></div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* About Us Section */}
      <AboutUsSection />

      {/* Interactive Features */}
      <section className="py-16 px-4 bg-[#0A1628]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-pixel text-[#F8E8BE] mb-12 text-center">Meet Our Agents</h2>

          <InteractiveFeatures />
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-[#F8E8BE]/70 bg-[#0A1628] font-pixel">
        <div className="container mx-auto max-w-6xl">
          <p className="mb-4">© 2025 TH3 ARK. All rights reserved.</p>
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:text-[#FFD86E] transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-[#FFD86E] transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-[#FFD86E] transition-colors">
              GitHub
            </a>
          </div>
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/terms-of-service" className="hover:text-[#FFD86E] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#FFD86E] transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm">© 2025 TH3 ARK</p>
        </div>
      </footer>
    </div>
  )
}
