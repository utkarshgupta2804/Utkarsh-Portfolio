"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Settings,
  FolderOpen,
  Clock,
  GitBranch,
  File,
  Lock,
  Menu,
  Save,
  Code,
  ChevronDown,
  Upload,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Editor from "@monaco-editor/react"

const routes = [
  { name: "/about", method: "GET", description: "Personal information & goals" },
  { name: "/experience", method: "GET", description: "Work experience & internships" },
  { name: "/projects", method: "GET", description: "Technical projects" },
  { name: "/skills", method: "GET", description: "Technologies & proficiencies" },
  { name: "/achievements", method: "GET", description: "Awards & accomplishments" },
  { name: "/contact", method: "POST", description: "Create contact with params, body & docs" },
]

const httpMethods = [
  { name: "GET", color: "text-[#49cc90]" },
  { name: "POST", color: "text-[#fca130]" },
]

type SidePanel = "collections" | "guide" | "projects" | "opensource" | null

export default function PortfolioPostman() {
  const [activeRoute, setActiveRoute] = useState("/about")
  const [urlInput, setUrlInput] = useState("/about")
  const [selectedMethod, setSelectedMethod] = useState("GET")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("Docs")
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(true)
  const [splitRatio, setSplitRatio] = useState(55)
  const [isDragging, setIsDragging] = useState(false)
  const [params, setParams] = useState([{ key: "", value: "", description: "", enabled: true }])
  const [headers, setHeaders] = useState([{ key: "", value: "", description: "", enabled: true }])
  const [bodyContent, setBodyContent] = useState("")
  const [bodyType, setBodyType] = useState("raw")
  const [rawDataType, setRawDataType] = useState("JSON")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [iconSidebarOpen, setIconSidebarOpen] = useState(true)
  const [sidePanel, setSidePanel] = useState<SidePanel>("collections")
  const [docFile, setDocFile] = useState<File | null>(null)

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const onMouseDown = () => setIsDragging(true)

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const container = document.getElementById("main-split-container")
    if (!container) return

    const rect = container.getBoundingClientRect()
    const newRatio = ((e.clientY - rect.top) / rect.height) * 100

    if (newRatio > 20 && newRatio < 80) {
      setSplitRatio(newRatio)
    }
  }

  const onMouseUp = () => setIsDragging(false)

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [isDragging])

  const hasValidData = () => {
    // Check if body has valid data (only if raw is selected and not empty)
    const hasBodyData = bodyType === "raw" && bodyContent.trim() !== ""

    // Check if params have valid data (at least one enabled param with key)
    const hasParamData = params.some((p) => p.enabled && p.key.trim() !== "")

    // Check if docs have valid file
    const hasDocData = docFile !== null

    return hasBodyData || hasParamData || hasDocData
  }

  const handleSendRequest = async () => {
    if (selectedMethod === "POST" && !hasValidData()) {
      setResponse({ error: "No data given" })
      setStatusCode(400)
      setResponseTime(0)
      return
    }

    setLoading(true)
    const startTime = Date.now()

    try {
      // Build URL with query params
      let url = `/api${urlInput}`

      const enabledParams = params.filter((p) => p.enabled && p.key.trim() !== "")
      if (enabledParams.length > 0) {
        const queryString = enabledParams
          .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
          .join("&")
        url += `?${queryString}`
      }

      // Prepare request options
      const options: RequestInit = {
        method: selectedMethod,
        headers: {} as Record<string, string>,
      }

      // Add enabled headers
      const enabledHeaders = headers.filter((h) => h.enabled && h.key)
      enabledHeaders.forEach((h) => {
        if (options.headers) {
          ;(options.headers as Record<string, string>)[h.key] = h.value
        }
      })

      // Add body for POST, PUT, PATCH methods
      if (["POST", "PUT", "PATCH"].includes(selectedMethod)) {
        if (docFile) {
          // Handle file upload with FormData
          const formData = new FormData()
          formData.append("document", docFile)

          // Only add body content if it exists
          if (bodyType === "raw" && bodyContent.trim()) {
            formData.append("data", bodyContent)
          }

          options.body = formData
          // Don't set Content-Type for FormData - browser will set it with boundary
        } else if (bodyType === "raw" && bodyContent.trim()) {
          // Only send body if raw is selected and has content
          if (rawDataType === "JSON") {
            ;(options.headers as Record<string, string>)["Content-Type"] = "application/json"
          } else {
            ;(options.headers as Record<string, string>)["Content-Type"] = "text/plain"
          }
          options.body = bodyContent
        }
        // If neither file nor body content, don't add body (params only)
      }

      const res = await fetch(url, options)
      const contentType = res.headers.get("content-type")
      let data
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json()
      } else {
        data = await res.text()
      }
      const endTime = Date.now()

      setResponse(data)
      setStatusCode(res.status)
      setResponseTime(endTime - startTime)
    } catch (error) {
      console.error("[v0] Request failed:", error)
      setResponse({ error: "Failed to fetch data", details: String(error) })
      setStatusCode(500)
      setResponseTime(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRouteSelect = (routeName: string, method?: string) => {
    setActiveRoute(routeName)
    setUrlInput(routeName)
    if (method) {
      setSelectedMethod(method)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("http://localhost:8080/api", "")
    setUrlInput(value)
  }

  function highlightJSON(json: any) {
    if (typeof json === "string") {
      try {
        json = JSON.parse(json)
      } catch (e) {
        // If it's not a valid JSON string, return it as is
        return json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      }
    }

    const jsonString = JSON.stringify(json, null, 2).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    return jsonString.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-[#ce9178]" // string (default)

        if (/^"/.test(match)) {
          cls = /:$/.test(match)
            ? "text-[#9cdcfe]" // key
            : "text-[#ce9178]" // string value
        } else if (/true|false/.test(match)) {
          cls = "text-[#569cd6]" // boolean
        } else if (/null/.test(match)) {
          cls = "text-[#c586c0]" // null
        } else {
          cls = "text-[#b5cea8]" // number
        }

        return `<span class="${cls}">${match}</span>`
      },
    )
  }

  const getPlaceholderForDataType = (dataType: string) => {
    switch (dataType) {
      case "JSON":
        return `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}`
      case "Text":
        return "Enter plain text here..."
      case "JavaScript":
        return `// Write JavaScript code
function hello() {
  console.log("Hello World");
}`
      case "HTML":
        return `<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`
      case "XML":
        return `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item>
    <name>Example</name>
    <value>123</value>
  </item>
</root>`
      default:
        return "Enter your data here..."
    }
  }

  const handleRawDataTypeChange = (newType: string) => {
    setRawDataType(newType)
    // Optionally clear or update content when switching types
    if (!bodyContent) {
      setBodyContent("")
    }
  }

  // Add file upload UI handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocFile(file)
    }
  }

  const removeFile = () => {
    setDocFile(null)
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white">
      {/* Top Navigation Bar */}
      <div className="bg-[#252525] border-b border-[#2c2c2c] px-2 sm:px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen((prev) => !prev)
              } else {
                setIconSidebarOpen((prev) => !prev)
              }
            }}
            title={iconSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            className={`p-1 rounded transition-colors ${iconSidebarOpen ? "bg-[#2c2c2c]" : "hover:bg-[#2c2c2c]"}`}
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-4 ml-4 text-sm">
            <button className="text-gray-300 hover:text-white">Utkarsh's</button>
            <button className="text-gray-300 hover:text-white">Portfolio</button>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Postman"
              className="w-full bg-[#2c2c2c] border border-[#3a3a3a] rounded px-9 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#3a3a3a]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => window.open("https://www.linkedin.com/in/utkarsh-gupta-5aa661261", "_blank")}
            title="LinkedIn"
            className="p-1 sm:p-1.5 hover:bg-[#2c2c2c] rounded text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 23.98h4.56V7.98H.22v16zM8.48 7.98h4.37v2.18h.06c.61-1.15 2.1-2.37 4.33-2.37 4.63 0 5.48 3.05 5.48 7.01v9.18h-4.56v-8.14c0-1.94-.03-4.44-2.71-4.44-2.71 0-3.13 2.12-3.13 4.3v8.28H8.48v-16z" />
            </svg>
          </button>

          <button
            onClick={() => window.open("https://github.com/utkarshgupta2804", "_blank")}
            title="GitHub"
            className="p-1 sm:p-1.5 hover:bg-[#2c2c2c] rounded text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.73.5.5 5.74.5 12.04c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.38-3.87-1.38-.53-1.36-1.29-1.72-1.29-1.72-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.3-5.26-1.29-5.26-5.74 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.19a11.05 11.05 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.65.23 2.87.11 3.17.74.81 1.18 1.84 1.18 3.11 0 4.46-2.7 5.44-5.28 5.73.41.36.78 1.07.78 2.16v3.2c0 .31.2.66.79.55A11.54 11.54 0 0 0 23.5 12.04C23.5 5.74 18.27.5 12 .5z" />
            </svg>
          </button>
          <button
            onClick={() =>
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=utkarsh2804gupta@gmail.com&su=Hello%20Utkarsh&body=Hi%20Utkarsh,%0A%0A",
                "_blank",
              )
            }
            title="Email Utkarsh"
            className="p-1 sm:p-1.5 hover:bg-[#2c2c2c] rounded"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-[#2c2c2c]">
              <Image
                src="/me_better.png"
                alt="Utkarsh"
                width={24}
                height={24}
                className="object-cover object-[50%_80%]"
              />
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
        )}

        {/* Left Icon Sidebar */}
        {iconSidebarOpen && (
          <div
            className={`
            bg-[#252525] border-r border-[#2c2c2c] flex flex-col items-center py-3 sm:py-4 px-1 sm:px-2 gap-3 sm:gap-4
            md:relative md:translate-x-0
            ${mobileSidebarOpen ? "fixed left-0 top-[53px] bottom-0 z-50 translate-x-0" : "hidden md:flex"}
          `}
          >
            <button
              onClick={() => setSidePanel((prev) => (prev === "collections" ? null : "collections"))}
              className={`p-1.5 sm:p-2 rounded border-l-2 ${
                sidePanel === "collections" ? "bg-[#2c2c2c] border-[#ff6c37]" : "hover:bg-[#2c2c2c] border-transparent"
              }`}
              title="Collections"
            >
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setSidePanel((prev) => (prev === "guide" ? null : "guide"))}
              className={`p-1.5 sm:p-2 rounded border-l-2 ${
                sidePanel === "guide" ? "bg-[#2c2c2c] border-[#ff6c37]" : "hover:bg-[#2c2c2c] border-transparent"
              }`}
              title="Guide"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setSidePanel((prev) => (prev === "projects" ? null : "projects"))}
              className={`p-1.5 sm:p-2 rounded border-l-2 ${
                sidePanel === "projects" ? "bg-[#2c2c2c] border-[#ff6c37]" : "hover:bg-[#2c2c2c] border-transparent"
              }`}
              title="Projects & Blogs"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setSidePanel((prev) => (prev === "opensource" ? null : "opensource"))}
              className={`p-1.5 sm:p-2 rounded border-l-2 ${
                sidePanel === "opensource" ? "bg-[#2c2c2c] border-[#ff6c37]" : "hover:bg-[#2c2c2c] border-transparent"
              }`}
              title="Open Source"
            >
              <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1"></div>
          </div>
        )}

        {/* Collections Sidebar */}
        {iconSidebarOpen && sidePanel && (
          <div
            className={`
            w-60 sm:w-72 bg-[#1e1e1e] border-r border-[#2c2c2c] flex flex-col
            md:relative md:translate-x-0
            ${mobileSidebarOpen ? "fixed left-[49px] top-[53px] bottom-0 z-50 translate-x-0" : "hidden md:flex"}
          `}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#2c2c2c]">
              <h2 className="text-sm font-semibold text-gray-300">
                {sidePanel === "collections"
                  ? "Collections"
                  : sidePanel === "guide"
                    ? "GuideTab"
                    : sidePanel === "projects"
                      ? "My Projects & Blogs"
                      : "Open Source Contributions"}
              </h2>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* ================= COLLECTIONS (UNCHANGED) ================= */}
              {sidePanel === "collections" && (
                <>
                  <div className="mb-3">
                    <button
                      onClick={() => setCollectionsOpen(!collectionsOpen)}
                      className="flex items-center gap-2 mb-2 px-2 w-full hover:bg-[#252525] rounded py-1"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${collectionsOpen ? "" : "-rotate-90"}`}
                      />
                      <span className="text-sm font-semibold text-gray-200">Utkarsh Portfolio API</span>
                    </button>
                  </div>

                  {collectionsOpen && (
                    <div className="space-y-0.5 pl-4">
                      {routes.map((route, index) => {
                        const methodColor = httpMethods.find((m) => m.name === route.method)?.color || "text-gray-400"
                        const routeKey = `${route.name}-${route.method}-${index}`

                        return (
                          <button
                            key={routeKey}
                            onClick={() => handleRouteSelect(route.name, route.method)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              activeRoute === route.name && selectedMethod === route.method
                                ? "bg-[#2c2c2c] border-l-2 border-[#ff6c37]"
                                : "text-gray-400 hover:bg-[#252525]"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${methodColor}`}>{route.method}</span>
                              <span
                                className={
                                  activeRoute === route.name && selectedMethod === route.method
                                    ? "text-white"
                                    : "text-gray-400"
                                }
                              >
                                {route.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 ml-12">{route.description}</div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {/* ================= GUIDETAB ================= */}
              {sidePanel === "guide" && (
                <div className="text-sm text-gray-400 space-y-4">
                  <p className="text-gray-300 font-semibold">Welcome 👋</p>

                  <p>
                    This is my <span className="text-gray-300 font-medium">Postman-style portfolio</span>, designed to
                    demonstrate my backend, API design, and frontend interaction skills in a familiar developer
                    interface.
                  </p>

                  <p>
                    The application is assumed to be running on
                    <span className="text-gray-300 font-medium"> localhost:8080</span>.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>Select APIs directly from the left collections panel</li>
                    <li>Or manually type endpoints in the request URL bar</li>
                    <li>
                      The <span className="text-gray-300 font-medium">save icon</span> opens my resume
                    </li>
                  </ul>

                  <div className="border-t border-[#2c2c2c] pt-3 space-y-2">
                    <p>
                      In the <span className="text-gray-300 font-medium">Response</span> section, you can access my{" "}
                      <span className="text-gray-300 font-medium">X (Twitter)</span> and{" "}
                      <span className="text-gray-300 font-medium">Medium</span> profiles.
                    </p>

                    <p>
                      Clicking on my <span className="text-gray-300 font-medium">profile photo</span> will directly open
                      your email client to contact me.
                    </p>
                  </div>
                </div>
              )}
              {/* ================= PROJECTS ================= */}
              {sidePanel === "projects" && (
                <div className="space-y-4">
                  {/* Projects Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#ff6c37]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v8h12V6H4z" />
                      </svg>
                      My Projects
                    </h3>
                    <div className="space-y-2">
                      <a
                        href="https://github.com/utkarshgupta2804/Utkarsh-Portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2.5 rounded text-sm bg-[#252525] hover:bg-[#2c2c2c] border border-[#2c2c2c] hover:border-[#3a3a3a] transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-200 group-hover:text-[#ff6c37] transition-colors">
                              Postman Portfolio
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Interactive portfolio mimicking Postman UI</div>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-500 group-hover:text-gray-400 flex-shrink-0 ml-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034z" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            TypeScript
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            Featured
                          </span>
                        </div>
                      </a>
                      <a
                        href="https://github.com/utkarshgupta2804/omegle-clone"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2.5 rounded text-sm bg-[#252525] hover:bg-[#2c2c2c] border border-[#2c2c2c] hover:border-[#3a3a3a] transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-200 group-hover:text-[#ff6c37] transition-colors">
                              Omegle Clone
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Real-time anonymous chat application with queue-based user matching
                            </div>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-500 group-hover:text-gray-400 flex-shrink-0 ml-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034z" />
                          </svg>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            TypeScript
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            WebRTC
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Socket.IO
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-xs">
                          <a
                            href="https://omegle-clone-nine-silk.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ff6c37] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Live Demo →
                          </a>
                          <span className="text-gray-600">|</span>
                          <span className="text-gray-500">Vercel Deployment</span>
                        </div>
                      </a>

                      <a
                        href="https://github.com/utkarshgupta2804"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 rounded text-sm text-gray-400 hover:bg-[#252525] hover:text-gray-300 transition-colors"
                      >
                        View all projects →
                      </a>
                    </div>
                  </div>

                  {/* Blogs Section */}
                  <div className="pt-4 border-t border-[#2c2c2c]">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#ff6c37]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Blogs
                    </h3>
                    <div className="space-y-2">
                      <a
                        href="https://medium.com/@utkarsh2804gupta/scaling-qr-generation-lessons-from-building-a-dynamic-batch-system-aa3913ea96e8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-3 rounded bg-[#252525] border border-[#2c2c2c] hover:bg-[#2c2c2c] transition-colors"
                      >
                        <div className="text-sm font-semibold text-gray-200 mb-1">
                          Scaling QR Generation: Lessons from Building a Dynamic Batch System
                        </div>
                        <div className="text-xs text-gray-500">Medium · System Design · Backend Engineering</div>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= OPEN SOURCE ================= */}
              {sidePanel === "opensource" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-[#ff6c37]" />
                      My Contributions
                    </h3>
                    <div className="space-y-3">
                      <div className="px-3 py-3 rounded text-sm bg-[#252525] border border-[#2c2c2c]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-gray-200">Open Source Projects</div>
                            <div className="text-xs text-gray-500 mt-1">Contributing to various repositories</div>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 .5C5.73.5.5 5.74.5 12.04c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-2.17c-3.2.7-3.87-1.38-3.87-1.38-.53-1.36-1.29-1.72-1.29-1.72-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.56-.3-5.26-1.29-5.26-5.74 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.19a11.05 11.05 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.65.23 2.87.11 3.17.74.81 1.18 1.84 1.18 3.11 0 4.46-2.7 5.44-5.28 5.73.41.36.78 1.07.78 2.16v3.2c0 .31.2.66.79.55A11.54 11.54 0 0 0 23.5 12.04C23.5 5.74 18.27.5 12 .5z" />
                          </svg>
                        </div>

                        <div className="space-y-2 mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Pull Requests</span>
                            <span className="text-gray-500">Coming soon</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Issues Opened</span>
                            <span className="text-gray-500">Coming soon</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Code Reviews</span>
                            <span className="text-gray-500">Coming soon</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div id="main-split-container" className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col overflow-hidden" style={{ height: `${splitRatio}%` }}>
            {/* Tabs Bar */}
            <div className="bg-[#252525] border-b border-[#2c2c2c] flex items-center gap-1 sm:gap-2 px-1 sm:px-2 overflow-x-auto">
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#1e1e1e] border-b-2 border-[#ff6c37] text-xs sm:text-sm whitespace-nowrap">
                <div className="w-2 h-2 bg-[#49cc90] rounded-full"></div>
                <span className="text-gray-300">{selectedMethod}</span>
                <span className="text-gray-400 hidden sm:inline">{urlInput}</span>
              </button>
            </div>

            {/* Request URL Section */}
            <div className="bg-[#1e1e1e] border-b border-[#2c2c2c] p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2 flex-1 bg-[#252525] rounded border border-[#2c2c2c]">
                  <div className="relative">
                    <button
                      onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
                      className="flex items-center gap-1 sm:gap-2 bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 font-semibold text-xs sm:text-sm focus:outline-none border-r border-[#2c2c2c] hover:bg-[#2c2c2c]"
                    >
                      <span className={httpMethods.find((m) => m.name === selectedMethod)?.color}>
                        {selectedMethod}
                      </span>
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>

                    {methodDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-[#252525] border border-[#2c2c2c] rounded shadow-lg z-50 min-w-[120px] sm:min-w-[180px]">
                        {httpMethods.map((method) => (
                          <button
                            key={method.name}
                            onClick={() => {
                              setSelectedMethod(method.name)
                              setMethodDropdownOpen(false)
                            }}
                            className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-[#2c2c2c] transition-colors"
                          >
                            <span className={`font-semibold text-xs sm:text-sm ${method.color}`}>{method.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={`http://localhost:8080/api${urlInput}`}
                    onChange={handleUrlChange}
                    className="flex-1 bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 outline-none text-xs sm:text-sm text-gray-300 focus:bg-[#2c2c2c] min-w-0"
                    placeholder="Enter request URL"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSendRequest}
                    disabled={loading}
                    className="flex-1 sm:flex-none bg-[#ff6c37] hover:bg-[#ff7e4f] text-white px-4 sm:px-6 py-2 sm:py-2.5 h-auto font-semibold text-xs sm:text-sm"
                  >
                    {loading ? "Sending..." : "Send"}
                  </Button>
                  <button
                    onClick={() => window.open("/Utkarsh_Resume.pdf", "_blank")}
                    className="p-2 hover:bg-[#252525] rounded"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Updated Request Tabs Section */}
              <div className="flex items-center gap-1 px-2 sm:px-4 border-b border-[#2c2c2c] overflow-x-auto">
                {["Docs", "Body"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab
                        ? "text-white border-[#ff6c37]"
                        : "text-gray-400 hover:text-gray-300 border-transparent"
                    }`}
                  >
                    {tab}
                    {tab === "Headers" && " (9)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto bg-[#1e1e1e]">
              {/* Docs Tab */}
              {activeTab === "Docs" && (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Documentation</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">
                      {urlInput === "/contact" &&
                        selectedMethod === "POST" &&
                        "Create a new contact entry. You can send data via query params, request body (JSON or text), and attach documents. All data is stored in MongoDB and a contact ID is returned."}
                      {urlInput === "/contact" &&
                        selectedMethod === "PUT" &&
                        "Update an existing contact. Provide the contactId as a query parameter (?contactId=xxx) and include the fields you want to update in the request body."}
                      {urlInput === "/contact" &&
                        selectedMethod === "DELETE" &&
                        "Delete a contact by providing the contactId as a query parameter (?contactId=xxx). Returns the deleted contact data."}
                      {urlInput !== "/contact" &&
                        "Use JavaScript to write tests, visualize response, and more. Ctrl+Alt+P to Ask AI"}
                    </p>

                    {urlInput === "/contact" && selectedMethod === "POST" && (
                      <div className="mt-4 p-3 bg-[#252525] rounded border border-[#2c2c2c]">
                        <label className="text-sm text-gray-300 mb-2 block">Upload Document:</label>
                        <input type="file" onChange={handleFileSelect} className="hidden" id="doc-upload" />
                        <label
                          htmlFor="doc-upload"
                          className="flex items-center gap-2 px-3 py-2 bg-[#2c2c2c] hover:bg-[#333] rounded cursor-pointer text-sm text-gray-300 w-fit"
                        >
                          <Upload className="w-4 h-4" />
                          Choose File
                        </label>
                        {docFile && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                            <File className="w-4 h-4" />
                            <span>{docFile.name}</span>
                            <button onClick={removeFile} className="ml-auto text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "Body" && (
                <div className="space-y-3">
                  {/* Body Type Selector Row */}
                  <div className="flex items-center gap-4 mb-3 ml-3 mr-3">
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        name="bodyType"
                        value="none"
                        checked={bodyType === "none"}
                        onChange={(e) => setBodyType(e.target.value)}
                        className="accent-[#ff6c37]"
                      />
                      none
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="bodyType"
                        value="raw"
                        checked={bodyType === "raw"}
                        onChange={(e) => setBodyType(e.target.value)}
                        className="accent-[#ff6c37]"
                      />
                      <span className={bodyType === "raw" ? "text-gray-200" : "text-gray-400"}>raw</span>
                    </label>
                    {/* Raw controls aligned to the right (like old UI) */}
                    {bodyType === "raw" && (
                      <>
                        <select
                          value={rawDataType}
                          onChange={(e) => handleRawDataTypeChange(e.target.value)}
                          className="ml-auto bg-[#252525] text-[#4a9eff] text-sm px-3 py-1 rounded border border-[#2c2c2c] focus:outline-none mt-2"
                        >
                          <option value="JSON">JSON</option>
                          <option value="Text">Text</option>
                        </select>
                      </>
                    )}
                  </div>
                  {/* Raw Editor */}
                  {bodyType === "raw" && (
                    <div className="bg-[#252525] rounded border border-[#2c2c2c] overflow-hidden">
                      <Editor
                        height="200px"
                        defaultLanguage={rawDataType.toLowerCase()}
                        language={rawDataType.toLowerCase()}
                        theme="vs-dark"
                        value={bodyContent}
                        onChange={(value) => setBodyContent(value || "")}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 2,
                        }}
                      />
                    </div>
                  )}
                  {/* None State */}
                  {bodyType === "none" && (
                    <div className="py-8 text-center text-gray-500 text-sm">This request does not have a body</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            onMouseDown={onMouseDown}
            className="hidden sm:block h-1 bg-[#2c2c2c] cursor-row-resize hover:bg-[#ff6c37]"
          />

          {/* Response Section */}
          <div className="flex flex-col overflow-hidden" style={{ height: `${100 - splitRatio}%` }}>
            <div className="bg-[#252525] border-b border-[#2c2c2c] px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm pl-2">
                <button className="text-gray-200 pb-1 border-b-2 border-[#ff6c37] flex items-center gap-2 ">
                  Response
                </button>
              </div>
              {statusCode && (
                <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs flex-wrap">
                  <span className={`font-semibold ${statusCode === 200 ? "text-[#49cc90]" : "text-red-500"}`}>
                    Status: {statusCode} {statusCode === 200 ? "OK" : "Error"}
                  </span>
                  <span className="text-gray-400">Time: {responseTime !== null ? `${responseTime} ms` : "-"}</span>
                  <span className="text-gray-400 hidden sm:inline">
                    Size: {response ? `${(JSON.stringify(response).length / 1024).toFixed(2)} KB` : "0 KB"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                <button
                  onClick={() => window.open("https://medium.com/@utkarsh2804gupta", "_blank")}
                  title="Medium"
                  className="p-1 sm:p-1.5 hover:bg-[#2c2c2c] rounded text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.54 12a6.46 6.46 0 1 1-12.92 0 6.46 6.46 0 0 1 12.92 0Zm7.46 0c0 3.34-1.6 6.05-3.57 6.05-1.97 0-3.57-2.71-3.57-6.05 0-3.34 1.6-6.05 3.57-6.05 1.97 0 3.57 2.71 3.57 6.05ZM24 12c0 2.99-.57 5.42-1.27 5.42-.7 0-1.27-2.43-1.27-5.42 0-2.99.57-5.42 1.27-5.42.7 0 1.27 2.43 1.27 5.42Z" />
                  </svg>
                </button>

                <button
                  onClick={() => window.open("https://x.com/utkarsh_2804", "_blank")}
                  title="X (Twitter)"
                  className="p-1 sm:p-1.5 hover:bg-[#2c2c2c] rounded text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2H21.6l-7.37 8.42L23 22h-6.8l-5.33-6.97L4.8 22H1.4l7.9-9.04L18.24 2Zm-1.2 18h1.86L7.02 4H5.08l11.96 16Z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Response Body */}
            <div className="flex-1 overflow-auto postman-scrollbar">
              {response ? (
                <div className="p-2 sm:p-4">
                  <div className="bg-[#252525] rounded border border-[#2c2c2c] p-2 sm:p-4">
                    <pre
                      className="text-[10px] sm:text-xs font-mono leading-relaxed whitespace-pre-wrap break-words overflow-x-hidden"
                      dangerouslySetInnerHTML={{
                        __html: highlightJSON(response),
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                  <div className="relative w-32 h-32 sm:w-48 sm:h-48 mb-4 opacity-50">
                    <Image src="/postman-astronaut.jpg" alt="Postman astronaut" fill className="object-contain" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400">Click Send to get a response</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Toolbar */}
      <div className="hidden lg:flex bg-[#252525] border-t border-[#2c2c2c] px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
            </svg>
            Cloud View
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <Search className="w-4 h-4" />
            Find and replace
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <Code className="w-4 h-4" />
            Console
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <span>▶</span>
            Terminal
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <span>▶</span>
            Runner
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <GitBranch className="w-4 h-4" />
            Start Proxy
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3.003-2.938.005-.034.016-.134.017-.168a.998.998 0 0 0-1.254-1.006A3.002 3.002 0 0 1 15 7c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.716a1 1 0 0 0-1.067-1.236A9.956 9.956 0 0 0 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-.049-.003-.097-.007-.16a1.004 1.004 0 0 0-.395-.776zM8.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-2 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5-6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
            Cookies
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <Lock className="w-4 h-4" />
            Vault
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Trash
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-200">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
