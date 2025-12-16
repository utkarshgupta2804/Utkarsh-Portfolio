import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    workExperience: [
      {
        role: "Full Stack Developer Intern",
        company: "WECOFY TECHNOTIDES(OPC) PVT LTD",
        duration: "May 2025 - Jun 2025",
        location: "Remote",
        responsibilities: [
          "Led development of Prithvi Travels Admin Panel using Next.js & Firebase, improving operational efficiency by 30% & reducing page load time by 40% through responsive UI design & backend optimization",
          "Integrated 12+ APIs & resolved 15+ bugs, enhancing real-time data sync & improving user flow by 25% across client-facing applications",
          "Proposed & implemented three key improvements to data handling & routing protocols, leading to 15% reduction in API latency & faster response times across all connected services",
        ],
        technologies: ["Next.js", "Firebase", "React.js", "API Integration"],
      },
      {
        role: "Full Stack Web Developer",
        company: ".EXE | NITH",
        duration: "Nov 2024 - Present",
        location: "NIT Hamirpur",
        responsibilities: [
          "Architected & launched .EXE website using Next.js, improving page load speed by 45% and increasing mobile responsiveness by 60%",
          "Enhanced MemeBuzz app's backend with Express.js and improved user experience, driving engagement with over 1,000+ active users",
        ],
        technologies: ["Next.js", "Express.js", "Node.js", "MongoDB"],
      },
      {
        role: "Full-Stack Web Developer",
        company: "SPEC | NITH",
        duration: "Aug 2024 - Jan 2025",
        location: "NIT Hamirpur",
        responsibilities: [
          "Trained 200+ students through technical & non-technical workshops focused on backend development, emphasizing Express.js & Node.js fundamentals",
          "Innovated Compconnect Project, applying modern JavaScript & collaborating with other developers to meet user requirements",
          "Built Next.js stack web application for college's Eletrothon7.0, engaging 3,000+ users and facilitating 500+ team registrations",
        ],
        technologies: ["Next.js", "Express.js", "Node.js", "MongoDB", "React.js"],
      },
    ],
    totalExperience: "1+ year",
    companiesWorkedWith: 1,
    studentsTrained: "200+",
    usersImpacted: "4,000+",
  })
}
