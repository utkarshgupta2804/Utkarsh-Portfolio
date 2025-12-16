import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    technical: [
      {
        achievement: "Crescendo Innovation Event Funding",
        description: "Secured funding of Rs.30,000",
        year: 2025,
        organization: "NIT Hamirpur",
        category: "Innovation & Funding",
      },
      {
        achievement: "Third Prize - Startech Auction Competition",
        description: "Won Third Prize in competition organised by Indian Society for Technical Education",
        year: 2024,
        organization: "ISTE",
        category: "Technical Competition",
      },
      {
        achievement: "Successfully Deployed 7+ Production Projects",
        description: "Built and deployed multiple full-stack applications serving 4,000+ users",
        year: 2024 - 2025,
        category: "Project Delivery",
      },
      {
        achievement: "Trained 200+ Students",
        description: "Conducted workshops on backend development focusing on Express.js & Node.js",
        year: 2024,
        organization: "SPEC | NITH",
        category: "Teaching & Mentorship",
      },
    ],
    sports: [
      {
        achievement: "Interbranch Chess Competition Winner",
        description: "Won chess competition organised by NITH",
        year: 2024,
        organization: "NIT Hamirpur",
        category: "Chess",
      },
      {
        achievement: "National Chess Championship - State Level Gold Medal (2x)",
        description: "Represented Haryana in National Championship & won Gold medal at state level twice",
        year: 2020,
        organization: "National Chess Federation",
        category: "Chess",
      },
      {
        achievement: "National Roller Hockey Championship - Gold Medal",
        description: "Won Gold Medal in championship organized by RSFI",
        year: 2020,
        organization: "RSFI",
        category: "Roller Hockey",
      },
    ],
    impact: {
      funding: "Rs. 30,000",
      usersServed: "4,000+",
      studentsTrained: "200+",
      projectsDeployed: "7+",
      nationalRepresentation: true,
      goldMedals: 3,
    },
    recognition: [
      "Featured in college technical events",
      "Recognized for training contribution at SPEC",
      "State-level sports achiever",
      "National championship participant",
    ],
    uniqueStrengths: [
      "Competitive mindset from sports translated to technical excellence",
      "Leadership through training 200+ students",
      "Proven track record of building impactful projects",
      "Multi-talented: Technical skills + Athletic achievements",
    ],
  })
}
