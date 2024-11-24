// components/Sidebar/index.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHome } from "react-icons/io5";
import { GrProjects, GrUserWorker } from "react-icons/gr";
import { FaUserCircle, FaCog } from "react-icons/fa";
import { HiOutlineBell } from "react-icons/hi";

const Sidebar = ({ auxiliarClass = "", isMinimized = false }: { auxiliarClass: string; isMinimized: boolean }) => {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<number>(0); // Simulando notificações

  return (
    <aside
      className={` shadow-3xl text-white w-60 h-screen z-10 rounded-2xl py-6 ${auxiliarClass} ${
        isMinimized ? "w-9" : "w-60"
      } bg-gradient-to-b from-gray-900 via-purple-800 to-black mt-2 transition-all duration-300`}
    >
      <div className={`flex flex-col space-y-4 gap-2 ${isMinimized ? "justify-center items-center" : "pl-4"}`}>
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center space-x-2 ${pathname === "/" ? "text-purple-500" : "text-white"} text-lg hover:text-purple-500 transition-colors`}
        >
          <IoHome size={24} />
          {!isMinimized && <span className="text-sm">Início</span>}
        </Link>

        {/* Catalog */}
        <Link
          href="/catalog"
          className={`flex items-center space-x-2 ${pathname === "/catalog" ? "text-purple-500" : "text-white"} text-lg hover:text-purple-500 transition-colors`}
        >
          <GrProjects size={24} />
          {!isMinimized && <span className="text-sm">Catálogo</span>}
        </Link>

        {/* Post-Graduation */}
        <Link
          href="/post-graduation"
          className={`flex items-center space-x-2 ${pathname === "/post-graduation" ? "text-purple-500" : "text-white"} text-lg hover:text-purple-500 transition-colors`}
        >
          <GrUserWorker size={24} />
          {!isMinimized && <span className="text-sm">Pós-Graduação</span>}
        </Link>

        {/* Seção de Usuario */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <div className="flex items-center space-x-2">
            <FaUserCircle size={30} className="text-gray-300" />
            {!isMinimized && <span className="text-sm">Perfil do Usuário</span>}
          </div>
          {!isMinimized && (
            <ul className="mt-2 space-y-2 text-xs text-gray-400">
              <li>
                <Link
                  href="/profile"
                  className="hover:text-purple-500 transition-colors"
                >
                  Ver Perfil
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="hover:text-purple-500 transition-colors"
                >
                  Configurações
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Notificações */}
        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <HiOutlineBell size={24} className="text-gray-300" />
            {!isMinimized && <span className="text-sm">Notificações</span>}
            {notifications > 0 && !isMinimized && (
              <span className="bg-red-600 text-white rounded-full px-2 py-1 text-xs absolute top-2 right-2">
                {notifications}
              </span>
            )}
          </div>
          {!isMinimized && (
            <ul className="mt-2 space-y-2 text-xs text-gray-400">
              <li>
                <span className="hover:text-purple-500 transition-colors">Nova mensagem de cliente</span>
              </li>
              <li>
                <span className="hover:text-purple-500 transition-colors">Nova candidatura a projeto</span>
              </li>
            </ul>
          )}
        </div>

        {/* Configurações */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <div className="flex items-center space-x-2">
            <FaCog size={24} className="text-gray-300" />
            {!isMinimized && <span className="text-sm">Configurações</span>}
          </div>
          {!isMinimized && (
            <ul className="mt-2 space-y-2 text-xs text-gray-400">
              <li>
                <Link
                  href="/account-settings"
                  className="hover:text-purple-500 transition-colors"
                >
                  Configurações da Conta
                </Link>
              </li>
              <li>
                <Link
                  href="/preferences"
                  className="hover:text-purple-500 transition-colors"
                >
                  Preferências
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
