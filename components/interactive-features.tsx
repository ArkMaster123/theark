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
      imagePath: "/images/wizard-agent-large.png",
      color: "#5D4777",
      problemStatement: "Stuck in a creative rut or facing writer\'s block?",
      solutionOffered: "Wizard Whimsy conjures imaginative content, from compelling stories to unique character arcs, helping you break through creative barriers.",
      keyBenefits: ["Story Generation", "Creative Writing", "Character Development", "Plot Ideas"],
    },
    {
      id: "gary",
      name: "Gary Hormozi",
      role: "Business & Productivity Expert",
      imagePath: "/images/business-agent-large.png",
      color: "#2A623D",
      problemStatement: "Struggling to optimize your workflow or achieve business growth?",
      solutionOffered: "Gary Hormozi provides expert strategies for enhancing productivity, streamlining organization, and fostering sustainable business growth.",
      keyBenefits: ["Business Strategy", "Productivity Systems", "Goal Setting", "Performance Optimization"],
    },
    {
      id: "techno",
      name: "Orb of Ultimate Chaos",
      role: "Expert in Coding Chaos",
      imagePath: "/images/orbofchaos.png",
      color: "#A020F0",
      problemStatement: "Tired of predictable code and conventional solutions that lack spark?",
      solutionOffered: "The Orb of Ultimate Chaos injects delightful entropy into your projects, generating unconventional code and fostering truly creative problem-solving.",
      keyBenefits: ["Chaotic Code Generation", "Creative Problem Solving", "Entropy Engineering", "Unexpected Outcomes"],
    },
  ]

  return (
    <div id="agents" className="grid md:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div key={agent.id} className="flex flex-col">
          <motion.div
            className={`bg-[#0D1B33] border-2 border-[#F8E8BE] pixel-border overflow-hidden cursor-pointer transition-all flex flex-col ${
              activeAgent === agent.id ? "ring-2 ring-[#FFD86E]" : ""
            }`}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
          >
            <div className="relative h-48 bg-[#0A1628] w-full">
              <Image
                src={agent.imagePath || "/placeholder.svg"}
                alt={agent.name}
                fill
                className="object-contain p-4 pixelated"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between h-24">
              <h3 className="text-xl font-pixel mb-1 text-center" style={{ color: agent.color }}>
                {agent.name}
              </h3>
              <p className="text-sm text-[#F8E8BE]/80 text-center">{agent.role}</p>
            </div>
          </motion.div>

          <AnimatePresence>
            {activeAgent === agent.id && (
              <motion.div
                className="mt-4 bg-[#0A1628] border-2 border-[#F8E8BE] p-4 pixel-border space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h4 className="font-pixel mb-1 text-lg" style={{ color: agent.color }}>
                    The Problem:
                  </h4>
                  <p className="text-sm text-[#F8E8BE]/90">{agent.problemStatement}</p>
                </div>

                <div>
                  <h4 className="font-pixel mb-1 text-lg" style={{ color: agent.color }}>
                    Our Solution:
                  </h4>
                  <p className="text-sm text-[#F8E8BE]/90">{agent.solutionOffered}</p>
                </div>
                
                <div>
                  <h4 className="font-pixel mb-1 text-lg" style={{ color: agent.color }}>
                    Key Benefits & Features:
                  </h4>
                  <ul className="space-y-1">
                    {agent.keyBenefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        className="text-sm flex items-center text-[#F8E8BE]/90"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="inline-block w-2 h-2 bg-[#FFD86E] mr-2 flex-shrink-0"></span>
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F8E8BE]/30">
                  <p className="text-sm italic text-center text-[#F8E8BE]/70">This agent is brewing... Coming soon to TH3 ARK!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
