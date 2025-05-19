import { Search, Eye, MessageSquare, Sparkles } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: "search" | "eye" | "message-square" | "sparkles"
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <Search className="w-6 h-6 text-[#FFD86E]" />
      case "eye":
        return <Eye className="w-6 h-6 text-[#FFD86E]" />
      case "message-square":
        return <MessageSquare className="w-6 h-6 text-[#FFD86E]" />
      case "sparkles":
        return <Sparkles className="w-6 h-6 text-[#FFD86E]" />
      default:
        return <Sparkles className="w-6 h-6 text-[#FFD86E]" />
    }
  }

  return (
    <div className="bg-[#0A1628] p-6 border-2 border-[#F8E8BE] pixel-border">
      <div className="flex items-start gap-4">
        <div className="mt-1">{getIcon()}</div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-[#FFD86E]">{title}</h3>
          <p className="text-[#F8E8BE]">{description}</p>
        </div>
      </div>
    </div>
  )
}
