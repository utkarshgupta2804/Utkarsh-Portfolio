import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    languages: {
      frontend: ["JavaScript", "TypeScript", "HTML5", "CSS3"],
      backend: ["Python", "C/C++", "Go"],
      database: ["Firebase"],
    },
    frameworks: {
      frontend: ["React.js", "Next.js"],
      backend: ["Node.js", "Express.js", "Flask", "Go (net/http)", "Go (Gin)"],
      libraries: ["Socket.io", "Redis", "Multer", "Nodemailer", "Googleapis", "WebRTC"],
    },
    databases: {
      sql: ["PostgreSQL", "SQL"],
      noSQL: ["MongoDB"],
      cloud: ["Firebase"],
    },
    tools: {
      cloud: ["AWS"],
      containerization: ["Docker"],
      os: ["Ubuntu", "CentOS"],
      virtualization: ["Vagrant"],
      versionControl: ["Git"],
      SystemDesign: ["Excalidraw"],
    },
  })
}
