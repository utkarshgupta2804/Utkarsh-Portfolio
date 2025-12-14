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
    },
    expertise: {
      frontend: {
        level: "Advanced",
        skills: [
          "Building responsive UIs with React.js and Next.js",
          "State management and optimization",
          "Modern CSS and Tailwind CSS",
          "Mobile-first development",
        ],
      },
      backend: {
        level: "Advanced",
        skills: [
          "RESTful API development",
          "Real-time applications with WebSockets",
          "Database design and optimization",
          "Authentication and authorization",
          "Microservices architecture",
        ],
      },
      devOps: {
        level: "Intermediate",
        skills: [
          "AWS deployment and management",
          "Docker containerization",
          "CI/CD pipelines",
          "Server configuration and management",
        ],
      },
      systemDesign: {
        level: "Intermediate",
        skills: ["Load balancing", "Scalable architecture design", "Real-time systems", "Performance optimization"],
      },
    },
    currentlyLearning: ["Advanced system design patterns", "Kubernetes", "GraphQL", "Microservices architecture"],
    strengths: [
      "Full-stack development",
      "Real-time applications",
      "Scalable system design",
      "Performance optimization",
      "Quick learner",
      "Team collaboration",
    ],
  })
}
