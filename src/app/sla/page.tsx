'use client'

import { redirect } from "next/navigation";

export default function MyComponent() {
    const handleLogOut = async () => {
        await fetch('/api/logout')
        redirect('/login')
    }

  return (
    <button onClick={handleLogOut}>Delete Cookie</button>
  );
}
