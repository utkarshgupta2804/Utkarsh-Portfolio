import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { promises as fs } from "fs"
import path from "path"

async function parseFormData(request: NextRequest) {
    const formData = await request.formData()
    const files: Array<{ url: string; filename: string; size: number; type: string }> = []
    const fields: Record<string, any> = {}

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    try {
        await fs.mkdir(uploadDir, { recursive: true })
    } catch (error) {
        console.error("[v0] Failed to create upload directory:", error)
    }

    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            const buffer = Buffer.from(await value.arrayBuffer())
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
            const filename = uniqueSuffix + "-" + value.name
            const filepath = path.join(uploadDir, filename)

            try {
                await fs.writeFile(filepath, buffer)
                files.push({
                    url: `/uploads/${filename}`,
                    filename: value.name,
                    size: value.size,
                    type: value.type,
                })
            } catch (error) {
                console.error("[v0] Failed to save file:", error)
            }
        } else if (key === "data") {
            // Try to parse the data field if it exists
            try {
                const parsedData = JSON.parse(value as string)
                Object.assign(fields, parsedData)
            } catch {
                fields.message = value
            }
        } else {
            fields[key] = value
        }
    }

    return { files, fields }
}

// POST - Create new contact
export async function POST(request: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db("portfolio")
        const contacts = db.collection("contacts")

        // Get URL params
        const { searchParams } = new URL(request.url)
        const paramsData: Record<string, string> = {}
        searchParams.forEach((value, key) => {
            paramsData[key] = value
        })

        // Get body data based on content type
        const contentType = request.headers.get("content-type") || ""
        let bodyData: any = null
        let uploadedFiles: any[] = []

        if (contentType.includes("multipart/form-data")) {
            const { files, fields } = await parseFormData(request)
            bodyData = fields
            uploadedFiles = files
        } else if (contentType.includes("application/json")) {
            // Handle JSON data
            try {
                const text = await request.text()
                if (text.trim()) {
                    bodyData = JSON.parse(text)
                }
            } catch (error) {
                console.error("[v0] JSON parse error:", error)
            }
        } else if (contentType.includes("text/")) {
            // Handle plain text
            try {
                const textData = await request.text()
                if (textData.trim()) {
                    bodyData = { message: textData }
                }
            } catch (error) {
                console.error("[v0] Text parse error:", error)
            }
        } else {
            // Try to parse as text/JSON
            try {
                const text = await request.text()
                if (text.trim()) {
                    try {
                        bodyData = JSON.parse(text)
                    } catch {
                        bodyData = { message: text }
                    }
                }
            } catch (error) {
                console.error("[v0] Body parse error:", error)
            }
        }

        const hasParams = Object.keys(paramsData).length > 0
        const hasBody = bodyData && Object.keys(bodyData).length > 0
        const hasFiles = uploadedFiles.length > 0

        // Check if any data is provided
        if (!hasParams && !hasBody && !hasFiles) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No data given",
                },
                { status: 400 },
            )
        }

        const contactData: any = {
            ...(hasParams ? { params: paramsData } : {}),
            ...(hasBody ? bodyData : {}),
            ...(hasFiles ? { files: uploadedFiles } : {}),
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        // Insert into database
        const result = await contacts.insertOne(contactData)

        return NextResponse.json(
            {
                success: true,
                contactId: result.insertedId.toString(),
                data: contactData,
            },
            { status: 201 },
        )
    } catch (error: any) {
        console.error("[v0] POST /api/contact error:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create contact",
                message: error.message,
            },
            { status: 500 },
        )
    }
}
