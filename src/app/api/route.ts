import { NextResponse, NextRequest } from "next/server";

export function GET(req: NextRequest) {
    return NextResponse.json({ apiRoutes: [
        '/api/users',
        '/api/login'
    ] }, {status: 200})
}