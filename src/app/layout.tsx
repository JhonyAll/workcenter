import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { headers } from "next/headers";
import path from "path";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { child } from "firebase/database";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Worker Center",
  description: "Criado pelo grupo Z",
};

const WithNavbar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <Navbar />
    <div className="grid grid-cols-12">
      <Sidebar  auxiliarClass='grid-cols-subgrid col-span-1'/>
      <main className='grid-cols-subgrid col-span-11'>
      {children}
      </main>
    </div>
    </>
  )
}

const NoNavbar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    {children}  
    </>
  )
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
  
{
  const header = await headers();
  const pathname = header.get('x-current-path')
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >{
        !(pathname === '/login' || pathname === '/signup') ? (<WithNavbar children={children}/>) : (<NoNavbar children={children} />)
      }
      </body>
    </html>
  );
}
