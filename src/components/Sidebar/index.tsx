"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome } from "react-icons/io5";
import { GrProjects, GrUserWorker } from "react-icons/gr";

const Sidebar = ({auxiliarClass = ''}: {auxiliarClass: String}) => {
    const pathname = usePathname();

    return (
        <aside className={`bg-transparent text-white w-64 h-screen p-6 ${auxiliarClass}`}>
            <div className="flex flex-col space-y-4">
                <Link href="/" className={`flex items-center space-x-2 ${pathname === '/' ? 'text-purple-500' : 'text-white'} text-xl text-xl`}>
                    <IoHome size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/catalog" className={`flex items-center space-x-2 ${pathname === '/catalog' ? 'text-purple-500' : 'text-white'} text-xl`}>
                <IoHome size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/post-graduation" className={`flex items-center space-x-2 ${pathname === '/post-graduation' ? 'text-purple-500' : 'text-white'} text-xl`}>
                <IoHome size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/events" className={`flex items-center space-x-2 ${pathname === '/events' ? 'text-purple-500' : 'text-white'} text-xl`}>
                <IoHome size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/forum" className={`flex items-center space-x-2 ${pathname === '/forum' ? 'text-purple-500' : 'text-white'} text-xl`}>
                <IoHome size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/community" className={`flex items-center space-x-2 ${pathname === '/community' ? 'text-purple-500' : 'text-white'} text-xl`}>
                <IoHome size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/help" className={`flex items-center space-x-2 ${pathname === '/help' ? 'text-purple-500' : 'text-white'} text-xl`}>
                    <IoHome size={24} />
                    <span>Home</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;