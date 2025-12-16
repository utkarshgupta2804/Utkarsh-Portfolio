import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    name: "Utkarsh Gupta",
    email: "23bee112@ntih.ac.in",
    phone: "+91 7206758266",
    personality:
      [
        "I am a curious, fun-loving person who enjoys understanding how people, systems, and technology work.",
        "My interests span psychology, philosophy, tech, cinema and its directors, politics, and the economy, giving me a broad and evolving perspective.",
        "I am also a passionate Full Stack Developer focused on building scalable web applications and solving complex problems.",
        "With strong technical skills, leadership experience from organizing events and training students, and multiple national-level sports achievements, I bring discipline, competitiveness, and focus to everything I build."
      ],
    education: {
      college: {
        institution: "National Institute of Technology, Hamirpur",
        degree: "Bachelor's in Electrical Engineering",
        graduationYear: 2027,
      },
      school: {
        institution: "Swami Vivekanand Public School, Yamunanagar",
        graduationYear: 2022,
      },
    },
    hobbies: [
      "Watching Podcasts",
      "Got Interest in Anime recently coz of One Piece",
      "Listening Music",
      "Playing Chess and Roller Hockey",
      "Eating new dishes and tasty food",
    ],
    currentFocus: [
      "Mastering system design and architecture",
      "Building production-ready full-stack applications",
      "Learning and implementing cloud technologies (AWS, Docker)",
      "Contributing to open-source projects",
    ],
  })
}
