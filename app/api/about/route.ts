import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    name: "Utkarsh Gupta",
    email: "23bee112@ntih.ac.in",
    phone: "+91 7206758266",
    education: {
      college: {
        institution: "National Institute of Technology, Hamirpur",
        degree: "Bachelor's in Electrical Engineering",
        graduationYear: 2027,
        highlights: [
          "Secured funding of Rs.30,000 from Crescendo Innovation event [25']",
          "Won Third Price in Startech Auction Competition organised by Indian Society for Technical Education [24']",
          "Won Interbranch Chess Competition organised by NITH [24']",
        ],
      },
      school: {
        institution: "Swami Vivekanand Public School, Yamunanagar",
        graduationYear: 2022,
        highlights: [
          "Represented Haryana in National Chess Championship & won Gold medal at state level twice [20']",
          "Won Gold Medal in National Roller Hockey Championship organized by RSFI [20']",
        ],
      },
    },
    interests: [
      "Full-Stack Web Development",
      "Building scalable systems",
      "Real-time applications",
      "Chess",
      "Roller Hockey",
      "Competitive Programming",
    ],
    hobbies: [
      "Playing Chess",
      "Roller Hockey",
      "Learning new technologies",
      "Building side projects",
      "Participating in hackathons",
    ],
    personality:
      "A passionate Full Stack Developer who loves building scalable web applications and solving complex problems. Strong technical skills combined with leadership experience in organizing events and training students. Competitive by nature, as evidenced by multiple national-level sports achievements.",
    goal: "To become a world-class software engineer who builds impactful products that solve real-world problems at scale. Aiming to work on cutting-edge technologies and contribute to innovative solutions that make a difference in people's lives.",
    currentFocus: [
      "Mastering system design and architecture",
      "Building production-ready full-stack applications",
      "Learning cloud technologies (AWS, Docker)",
      "Contributing to open-source projects",
    ],
  })
}
