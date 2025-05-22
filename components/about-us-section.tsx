"use client"

import Image from "next/image"

export function AboutUsSection() {
  return (
    <section id="aboutUs" className="py-16 px-4 bg-[#0A1628]">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-pixel text-[#F8E8BE] mb-12 text-center">About Us</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-pixel text-[#FFD86E] mb-4">Three Founders, One Vision</h3>
            <p className="mb-6 text-[#F8E8BE]">
              Three successful founders. 55+ years building AI solutions. We watched the AI agent revolution unfold 
              from the inside the most powerful technology of our time was trapped in developer frameworks that 
              normal people couldn't experience.
            </p>
            <p className="mb-8 text-[#F8E8BE]">
              TH3 ARK is our answer making AI agents visible, playful, and accessible to everyone.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0D1B33] border-2 border-[#F8E8BE] pixel-border p-4 text-center">
                <p className="text-[#FFD86E] font-pixel text-xl md:text-2xl">Noah</p>
                <p className="text-sm text-[#F8E8BE]/80 font-pixel">Co-founder</p>
              </div>
              <div className="bg-[#0D1B33] border-2 border-[#F8E8BE] pixel-border p-4 text-center">
                <p className="text-[#FFD86E] font-pixel text-xl md:text-2xl">Steve</p>
                <p className="text-sm text-[#F8E8BE]/80 font-pixel">Co-founder</p>
              </div>
              <div className="bg-[#0D1B33] border-2 border-[#F8E8BE] pixel-border p-4 text-center">
                <p className="text-[#FFD86E] font-pixel text-xl md:text-2xl">Simon</p>
                <p className="text-sm text-[#F8E8BE]/80 font-pixel">Co-founder</p>
              </div>
            </div>
          </div>
          
          <div className="relative order-1 md:order-2 w-full aspect-square max-w-md mx-auto mb-6 md:mb-0">
            <Image
              src="/images/meettheteam.png"
              alt="The founders of TH3 ARK"
              fill
              className="object-contain pixelated border-2 border-[#F8E8BE] pixel-border"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 