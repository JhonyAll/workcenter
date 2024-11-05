import { NextResponse, NextRequest } from "next/server";

export function GET(req: NextRequest) {
    return NextResponse.json({ apiRoutes: [
        '/api/user',
        '/api/login'
    ] }, {status: 200})
}