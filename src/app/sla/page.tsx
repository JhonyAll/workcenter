'use client'

import { redirect } from "next/navigation";
import ImageCropper from "@/components/CropperImage";

export default function MyComponent() {
    const handleLogOut = async () => {
        await fetch('/api/logout')
        redirect('/login')
    }

  return (
    <div className="flex justify-center items-center gap-20 flex-col">
      <button onClick={handleLogOut}>Sair</button>
    </div>
  );
}
