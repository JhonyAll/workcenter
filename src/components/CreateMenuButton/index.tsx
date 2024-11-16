'use client'

import { useState } from "react";
import Link from "next/link";
import { IoAddCircleOutline } from "react-icons/io5";

const CreateMenuButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="fixed bottom-8 right-14 flex flex-col items-center">
      {/* Botão Principal */}
      <button
        className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all"
        onClick={toggleDropdown}
      >
        <IoAddCircleOutline size={32} />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="mt-2 mb-2 bg-gray-900 rounded-lg shadow-lg w-40 py-2 absolute bottom-16 flex flex-col items-center border border-gray-700">
          <Link
            href="/create-project"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white w-full text-center"
          >
            Criar Projeto
          </Link>
          <Link
            href="/create-post"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white w-full text-center"
          >
            Criar Post
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreateMenuButton;
