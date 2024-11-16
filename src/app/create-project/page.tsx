"use client";

import { useState } from "react";
import { IoIosClose, IoMdAdd } from "react-icons/io";
import { AiOutlinePhone, AiOutlineCalendar, AiOutlineUpload } from "react-icons/ai";
import { BsGeoAlt, BsCardList } from "react-icons/bs";
import Select from "react-select";

const CreateProjectPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [newSocialLink, setNewSocialLink] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState<File[]>([]);

  const locations = [
    { value: "sao-paulo", label: "São Paulo, SP" },
    { value: "rio-de-janeiro", label: "Rio de Janeiro, RJ" },
    { value: "belo-horizonte", label: "Belo Horizonte, MG" },
    { value: "curitiba", label: "Curitiba, PR" },
  ];

  const handleAddSocialLink = () => {
    if (newSocialLink.trim() && !socialLinks.includes(newSocialLink)) {
      setSocialLinks([...socialLinks, newSocialLink]);
      setNewSocialLink("");
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      setMedia([...media, ...Array.from(files)]);
    }
  };

  const handleCreateProject = () => {
    alert("Projeto criado com sucesso!");
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white p-4 pb-40 gap-10">
      {/* Formulário */}
      <div className="lg:w-1/2 w-full p-8 bg-gradient-to-b from-gray-900 via-purple-800 to-black rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Criar Novo Projeto</h1>
        <div className="space-y-6">
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

          {/* Contato */}
          <div className="flex items-center space-x-3">
            <AiOutlinePhone className="text-purple-400" />
            <input
              type="tel"
              placeholder="Telefone para Contato"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Localização */}
          <div className="flex items-center space-x-3">
            <BsGeoAlt className="text-purple-400" />
            <Select
              options={locations}
              placeholder="Selecione a localização"
              value={location}
              onChange={setLocation}
              className="flex-1"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1f2937",
                  borderColor: "#6b21a8",
                  color: "white",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9ca3af",
                }),
              }}
            />
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="text"
                placeholder="Adicionar link de rede social"
                value={newSocialLink}
                onChange={(e) => setNewSocialLink(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleAddSocialLink}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                <IoMdAdd />
              </button>
            </div>
            <div className="mt-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <BsCardList className="text-purple-400" />
                  <span className="text-gray-300">{link}</span>
                  <button
                    onClick={() => setSocialLinks(socialLinks.filter((l) => l !== link))}
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
                  <BsCardList className="text-purple-400" />
                  <span className="text-gray-300">{category}</span>
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

          {/* Orçamento */}
          <div className="flex items-center space-x-3">
            <AiOutlineCalendar className="text-purple-400" />
            <input
              type="text"
              placeholder="Orçamento estimado"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Prazo */}
          <div className="flex items-center space-x-3">
            <AiOutlineCalendar className="text-purple-400" />
            <input
              type="date"
              placeholder="Data de Conclusão"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Upload de Mídia */}
          <div>
            <h3 className="text-lg font-semibold">Anexos</h3>
            <div className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center hover:border-purple-300">
              <AiOutlineUpload className="text-2xl text-purple-400 mb-4" />
              <p className="text-gray-400">Arraste e solte arquivos ou clique aqui</p>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(e) => handleMediaUpload(e.target.files)}
                className="mt-4 text-purple-400"
              />
            </div>
          </div>

          {/* Botão de criar projeto */}
          <button
            onClick={handleCreateProject}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 mt-6"
          >
            Criar Projeto
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:w-1/2 w-full p-8 bg-gray-800 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Pré-visualização</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{title || "Título do Projeto"}</h3>
          <p className="text-gray-400">{description || "Descrição do projeto..."}</p>

          {/* Localização */}
          <p className="text-gray-400">Localização: {location ? location.label : "Não definida"}</p>

          {/* Redes Sociais */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="font-semibold">Redes Sociais</h4>
              <ul className="list-disc pl-5">
                {socialLinks.map((link, index) => (
                  <li key={index} className="text-gray-400">{link}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Categorias */}
          {categories.length > 0 && (
            <div>
              <h4 className="font-semibold">Categorias</h4>
              <ul className="list-disc pl-5">
                {categories.map((category, index) => (
                  <li key={index} className="text-gray-400">{category}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Orçamento */}
          <p className="text-gray-400">Orçamento: {budget || "Não definido"}</p>

          {/* Prazo */}
          <p className="text-gray-400">Prazo: {deadline || "Não definido"}</p>

          {/* Mídias */}
          {media.length > 0 && (
            <div>
              <h4 className="font-semibold">Mídias</h4>
              <div className="flex gap-4">
                {media.map((file, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-600 rounded-md">
                    <p className="text-center text-gray-400">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
