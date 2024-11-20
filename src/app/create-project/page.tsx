"use client";

import { useState } from "react";
import { IoIosClose, IoMdAdd } from "react-icons/io";
import { AiOutlinePhone, AiOutlineInstagram } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook, FaTelegram, FaLinkedin } from "react-icons/fa";
import Select from "react-select";

// Tipos definidos para localização e contato
type Location = {
  value: string;
  label: string;
};

type ContactType = "phone" | "whatsapp" | "instagram" | "facebook" | "telegram" | "linkedin";

type Contact = {
  type: ContactType;
  value: string;
};

const CreateProjectPage = () => {
  // Estados
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactType, setNewContactType] = useState<ContactType>("phone");
  const [newContactValue, setNewContactValue] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [location, setLocation] = useState<Location | null>(null);
  const [media, setMedia] = useState<File[]>([]);

  // Localizações disponíveis
  const locations: Location[] = [
    { value: "sao-paulo", label: "São Paulo, SP" },
    { value: "rio-de-janeiro", label: "Rio de Janeiro, RJ" },
    { value: "belo-horizonte", label: "Belo Horizonte, MG" },
    { value: "curitiba", label: "Curitiba, PR" },
  ];

  // Ícones para os meios de contato
  const contactIcons: Record<ContactType, JSX.Element> = {
    phone: <AiOutlinePhone className="text-purple-400" />,
    whatsapp: <BsWhatsapp className="text-green-500" />,
    instagram: <AiOutlineInstagram className="text-pink-400" />,
    facebook: <FaFacebook className="text-blue-500" />,
    telegram: <FaTelegram className="text-blue-400" />,
    linkedin: <FaLinkedin className="text-blue-600" />,
  };

  // Adicionar contato
  const handleAddContact = () => {
    if (newContactValue.trim()) {
      setContacts((prev) => [...prev, { type: newContactType, value: newContactValue }]);
      setNewContactValue("");
    }
  };

  // Adicionar categoria
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory("");
    }
  };

  // Upload de mídia
  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      setMedia((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Preview do projeto
  const handleCreateProject = () => {
    alert("Projeto criado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0A0A] text-white p-4 gap-10">
      {/* Formulário */}
      <div className="lg:w-1/2 h-[500px] p-8 bg-gradient-to-b from-gray-900 via-purple-800 to-black rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Criar Novo Projeto</h1>
        <div className="space-y-6 p-4 h-5/6 overflow-y-auto">
          {/* Título */}
          <input
            type="text"
            placeholder="Título do Projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          />

          {/* Descrição */}
          <textarea
            placeholder="Descreva os objetivos e detalhes do projeto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          />

          {/* Meios de Contato */}
          <div>
            <h3 className="text-lg font-semibold">Meios de Contato</h3>
            <div className="flex items-center mt-2 space-x-2">
              <select
                value={newContactType}
                onChange={(e) => setNewContactType(e.target.value as ContactType)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-400"
              >
                <option value="phone">Telefone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="telegram">Telegram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <input
                type="text"
                placeholder="Adicionar contato"
                value={newContactValue}
                onChange={(e) => setNewContactValue(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleAddContact}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                <IoMdAdd />
              </button>
            </div>
            <div className="mt-3">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  {contactIcons[contact.type]}
                  <span className="text-gray-300">{contact.value}</span>
                  <button
                    onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                    className="ml-auto text-red-500 hover:text-red-400"
                  >
                    <IoIosClose />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-lg font-semibold">Categorias</h3>
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="text"
                placeholder="Adicionar categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleAddCategory}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                <IoMdAdd />
              </button>
            </div>
            <div className="mt-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <span className="text-purple-400">#{category}</span>
                  <button
                    onClick={() => setCategories(categories.filter((c) => c !== category))}
                    className="ml-auto text-red-500 hover:text-red-400"
                  >
                    <IoIosClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:w-1/2 h-auto p-8 bg-gray-900 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4">Preview do Projeto</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{title || "Título do Projeto"}</h3>
          <p className="text-gray-400">{description || "Descrição do projeto aparecerá aqui."}</p>

          {/* Meios de Contato */}
          <div className="text-sm">
            <h4 className="font-semibold text-gray-300">Meios de Contato:</h4>
            {contacts.length > 0 ? (
              contacts.map((contact, idx) => (
                <div key={idx} className="flex items-center mt-1">
                  {contactIcons[contact.type]}
                  <span className="ml-2 text-gray-300">{contact.value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Nenhum meio de contato adicionado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
