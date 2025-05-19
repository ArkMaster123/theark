export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Join the waitlist",
      description: "Sign up to be among the first to experience THE ARK",
    },
    {
      number: 2,
      title: "Get early access",
      description: "Receive your invitation to board THE ARK",
    },
    {
      number: 3,
      title: "Explore THE ARK",
      description: "Discover the various AI agents in their natural habitat",
    },
    {
      number: 4,
      title: "Interact with agents",
      description: "Chat with and learn from your favorite AI companions",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFD86E] text-[#0D1B33] flex items-center justify-center text-2xl font-bold mb-4 pixel-circle">
            {step.number}
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#FFD86E]">{step.title}</h3>
          <p className="text-[#F8E8BE]">{step.description}</p>

          {step.number < steps.length && (
            <div className="hidden lg:block w-8 h-8 absolute right-[-4rem] top-[2rem] text-[#FFD86E]">→</div>
          )}
        </div>
      ))}
    </div>
  )
}
