import Link from "next/link"
import { Twitter, Github, DiscIcon as Discord } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-6">
      <Link href="#" className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors">
        <Twitter className="w-6 h-6" />
        <span className="sr-only">Twitter</span>
      </Link>
      <Link href="#" className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors">
        <Discord className="w-6 h-6" />
        <span className="sr-only">Discord</span>
      </Link>
      <Link href="#" className="text-[#F8E8BE] hover:text-[#FFD86E] transition-colors">
        <Github className="w-6 h-6" />
        <span className="sr-only">GitHub</span>
      </Link>
    </div>
  )
}
