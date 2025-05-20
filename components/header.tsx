"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string, callback?: () => void) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({ behavior: "smooth" })
    if (callback) {
      callback()
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0A1628] shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-pixel text-[#F8E8BE] hover:text-[#FFD86E] transition-colors">TH3 ARK</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#about"
              className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors"
              onClick={(e) => {
                e.preventDefault() // Prevent default hash jump
                scrollToSection("about")
              }}
            >
              About
            </Link>
            <Link
              href="#features"
              className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("features")
              }}
            >
              Features
            </Link>
            <Link
              href="#agents"
              className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("agents")
              }}
            >
              Agents
            </Link>
            <Link href="/login">
              <Button
                className="bg-transparent hover:bg-[#142237] text-[#F8E8BE] border border-[#F8E8BE] hover:text-[#FFD86E] font-pixel transition-all hover:scale-105 pixel-button"
              >
                Log In
              </Button>
            </Link>
            <Button
              className="bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button"
              onClick={() => scrollToSection("waitlist")}
            >
              Join Waitlist
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#F8E8BE]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col space-y-4 animate-fade-in">
            <Link
              href="#about"
              className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("about", () => setIsMobileMenuOpen(false))
              }}
            >
              About
            </Link>
            <Link
              href="#features"
              className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("features", () => setIsMobileMenuOpen(false))
              }}
            >
              Features
            </Link>
            <Link
              href="#agents"
              className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("agents", () => setIsMobileMenuOpen(false))
              }}
            >
              Agents
            </Link>
            <Link href="/login">
              <Button
                className="bg-transparent hover:bg-[#142237] text-[#F8E8BE] border border-[#F8E8BE] hover:text-[#FFD86E] font-pixel transition-all hover:scale-105 pixel-button w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Button>
            </Link>
            <Button
              className="bg-[#FFD86E] hover:bg-[#FFE898] text-[#0D1B33] font-pixel transition-all hover:scale-105 pixel-button w-full"
              onClick={() => {
                scrollToSection("waitlist", () => setIsMobileMenuOpen(false))
              }}
            >
              Join Waitlist
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
