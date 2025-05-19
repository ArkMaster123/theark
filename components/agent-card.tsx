import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface AgentCardProps {
  name: string
  description: string
  imagePath: string
}

export function AgentCard({ name, description, imagePath }: AgentCardProps) {
  return (
    <div className="bg-[#0D1B33] border-2 border-[#F8E8BE] pixel-border overflow-hidden">
      <div className="relative h-48 bg-[#0A1628]">
        <Image src={imagePath || "/placeholder.svg"} alt={name} fill className="object-contain p-4" />
        <Badge className="absolute top-2 right-2 bg-[#FFD86E] text-[#0D1B33] hover:bg-[#FFD86E]">Visit Soon</Badge>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-[#FFD86E]">{name}</h3>
        <p className="text-[#F8E8BE]">{description}</p>
      </div>
    </div>
  )
}
