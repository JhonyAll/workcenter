// components/Navbar/index.tsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMiniBars3 } from "react-icons/hi2";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import logo from "@/assets/img/logo.svg";
import { redirect } from "next/navigation";

const Navbar = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogOut = async () => {
    await fetch("/api/logout");
    redirect("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg col-span-12">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Botão de Menu e Logo */}
        <div className="flex items-center space-x-6">
          <button
            className="text-white text-xl focus:outline-none"
            onClick={onMenuToggle}
          >
            <HiMiniBars3 size={28} />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logo} alt="Logo" width={150} height={50} />
          </Link>
        </div>

        {/* Campo de Pesquisa */}
        <div className="hidden md:flex flex-grow justify-center">
          <input
            type="text"
            placeholder="Pesquisar..."
            className={`${
              isSearchFocused ? "w-4/5 lg:w-3/5" : "w-2/5 lg:w-2/5"
            } bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-[0.5px] focus:border-purple-400 transition-all duration-300  border border-gray-50`}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Ícone de Conta com Dropdown */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            {user && !(user.profilePhoto === 'N/A') ? (
              <Image
                src={user.profilePhoto}
                className="rounded-full border-2 border-purple-500"
                alt="Profile"
                width={50}
                height={50}
              />
            ) : (
              <FaUserCircle size={50} color="#A3A3A3" />
            )}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
              <div className="bg-purple-600 px-4 py-3">
                {user ? (
                  <p className="text-sm font-semibold text-white">
                    Bem-vindo, {user.name}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-white">Visitante</p>
                )}
              </div>
              <ul className="py-2">
                {user && (
                  <>
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white"
                      >
                        Perfil
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white"
                        onClick={handleLogOut}
                      >
                        Sair
                      </button>
                    </li>
                  </>
                )}
                {!user && (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white"
                      >
                        Cadastrar-se
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white"
                        onClick={handleLogOut}
                      >
                        Sair
                      </button>
                    </li>
                    
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
