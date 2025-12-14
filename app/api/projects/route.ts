import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    projects: [
      {
        name: "Peer-to-Peer Video Chat Website",
        date: "Sept 2025",
        description: "Real-time random video chat platform enabling P2P communication",
        features: [
          "Launched real-time random video chat website using WebRTC and sockets, enabling peer-to-peer (P2P) video calls & instant messaging between users",
          "Streamlined P2P data sharing mechanisms to minimize server dependency & ensure smooth, low-latency communication for randomly matched users",
        ],
        technologies: ["WebRTC", "Socket.io", "Node.js", "React.js", "Express.js"],
        highlights: {
          architecture: "Peer-to-peer communication",
          performance: "Low-latency video streaming",
          scalability: "Minimal server dependency",
        },
      },
      {
        name: "Scalable QR Code Generator with Scan Tracking",
        date: "Aug 2025",
        description: "Full-stack platform for bulk QR code generation and tracking",
        features: [
          "Developed full-stack web app (Next.js & Node.js with TypeScript) extending static QR API into platform supporting 100+ bulk Dynamic QR generations & one-time use validation with duplicate detection",
          "Configured and deployed responsive, scalable system on AWS Elastic Beanstalk, enabling fast, reliable deployments & efficient handling of concurrent users",
        ],
        technologies: ["Next.js", "Node.js", "TypeScript", "AWS Elastic Beanstalk", "PostgreSQL"],
        highlights: {
          scale: "100+ bulk QR code generations",
          deployment: "AWS Elastic Beanstalk",
          features: "One-time use validation, duplicate detection",
        },
      },
      {
        name: "Load Balancer | Go",
        date: "Jun 2025",
        description: "High-performance load balancer built with Go",
        features: [
          "Devised high-performance Go load balancer handling 10,000+ requests/sec with Least Connections, real-time health checks, atomic operations, and memory pooling",
          "Delivered live backend metrics, flexible configuration options, graceful shutdown handling, robust error management, and 85%+ test coverage to ensure production-grade stability & reliability",
        ],
        technologies: ["Go", "Go (net/http)", "Go (Gin)"],
        highlights: {
          performance: "10,000+ requests/sec",
          algorithm: "Least Connections",
          testCoverage: "85%+",
          features: "Real-time health checks, graceful shutdown",
        },
      },
      {
        name: "MemeBuzz App",
        date: "2024",
        description: "Social platform for meme sharing with 1,000+ active users",
        features: [
          "Enhanced backend with Express.js for improved performance",
          "Built engaging user experience driving high user engagement",
        ],
        technologies: ["Express.js", "Node.js", "MongoDB", "React.js"],
        highlights: {
          users: "1,000+ active users",
          type: "Social media platform",
        },
      },
      {
        name: "Compconnect Project",
        date: "2024",
        description: "Modern JavaScript application for connecting students",
        features: [
          "Innovated using modern JavaScript frameworks",
          "Collaborated with developers to meet user requirements",
        ],
        technologies: ["JavaScript", "React.js", "Node.js"],
        highlights: {
          collaboration: "Team project",
          focus: "User requirements",
        },
      },
      {
        name: "Eletrothon7.0 Website",
        date: "2024",
        description: "Event registration platform for college hackathon",
        features: [
          "Built Next.js stack web application",
          "Engaged 3,000+ users",
          "Facilitated 500+ team registrations",
        ],
        technologies: ["Next.js", "React.js", "Node.js"],
        highlights: {
          users: "3,000+ engaged users",
          registrations: "500+ teams",
        },
      },
      {
        name: "Prithvi Travels Admin Panel",
        date: "2025",
        description: "Admin dashboard for travel company operations",
        features: ["Improved operational efficiency by 30%", "Reduced page load time by 40%", "Integrated 12+ APIs"],
        technologies: ["Next.js", "Firebase", "React.js"],
        highlights: {
          efficiency: "30% improvement",
          performance: "40% faster load times",
          integrations: "12+ APIs",
        },
      },
    ],
    totalProjects: 7,
    technologies: [
      "Next.js",
      "React.js",
      "Node.js",
      "Express.js",
      "Go",
      "WebRTC",
      "Socket.io",
      "AWS",
      "Firebase",
      "TypeScript",
    ],
    focus: ["Real-time applications", "Scalable systems", "Full-stack development", "Cloud deployment"],
  })
}
