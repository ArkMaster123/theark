"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function InteractiveFeatures() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null)

  const agents = [
    {
      id: "wizard",
      name: "Wizard Whimsy",
      role: "Creative Assistant",
      description:
        "A magical assistant who specializes in creative writing, storytelling, and generating imaginative content.",
      abilities: ["Story Generation", "Creative Writing", "Character Development", "Plot Ideas"],
      imagePath: "/images/wizard-agent-large.png",
      color: "#5D4777",
    },
    {
      id: "gary",
      name: "Gary Hormozi",
      role: "Business & Productivity Expert",
      description: "Your professional companion for productivity, organization, and business growth strategies.",
      abilities: ["Business Strategy", "Productivity Systems", "Goal Setting", "Performance Optimization"],
      imagePath: "/images/business-agent-large.png",
      color: "#2A623D",
    },
    {
      id: "techno",
      name: "Techno Tron",
      role: "Technical Specialist",
      description: "A technical expert who can help with coding, development, and technical problem-solving.",
      abilities: ["Code Assistance", "Debugging Help", "Technical Explanations", "Development Tips"],
      imagePath: "/images/techno-agent-large.png",
      color: "#3DB9FC",
    },
  ]

  return (
    <div id="agents" className="grid md:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div key={agent.id} className="flex flex-col">
          <motion.div
            className={`bg-[#0D1B33] border-2 border-[#F8E8BE] pixel-border overflow-hidden cursor-pointer transition-all ${
              activeAgent === agent.id ? "ring-2 ring-[#FFD86E]" : ""
            }`}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
          >
            <div className="relative h-48 bg-[#0A1628]">
              <Image
                src={agent.imagePath || "/placeholder.svg"}
                alt={agent.name}
                fill
                className="object-contain p-4 pixelated"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-pixel mb-1" style={{ color: agent.color }}>
                {agent.name}
              </h3>
              <p className="text-sm text-[#F8E8BE]/80 mb-2">{agent.role}</p>
              <p className="text-sm line-clamp-2">{agent.description}</p>
            </div>
          </motion.div>

          <AnimatePresence>
            {activeAgent === agent.id && (
              <motion.div
                className="mt-4 bg-[#0A1628] border-2 border-[#F8E8BE] p-4 pixel-border"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-pixel mb-2" style={{ color: agent.color }}>
                  Abilities:
                </h4>
                <ul className="space-y-1">
                  {agent.abilities.map((ability, index) => (
                    <motion.li
                      key={index}
                      className="text-sm flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="inline-block w-2 h-2 bg-[#FFD86E] mr-2"></span>
                      {ability}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-[#F8E8BE]/30">
                  <p className="text-sm italic text-center">Coming soon to TH3 ARK...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
