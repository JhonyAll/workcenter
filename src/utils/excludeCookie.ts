import { cookies } from "next/headers";

export default async function deleteCookie (cookieName: string) {
    const cookiesStore = await cookies()
    cookiesStore.delete(cookieName)
}