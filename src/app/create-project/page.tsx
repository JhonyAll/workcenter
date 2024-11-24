"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosClose, IoMdAdd } from "react-icons/io";

const CreateProjectPage = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budgetType, setBudgetType] = useState<string>("negotiable");
  const [budgetValue, setBudgetValue] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState<string>("");

  const {user} = useUser()
  const router = useRouter()

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag)) {
      setHashtags((prev) => [...prev, newHashtag]);
      setNewHashtag("");
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setHashtags((prev) => prev.filter((h) => h !== hashtag));
  };

  const handlePublishProject = async () => {
    const body = {
      title,
      description,
      budget: budgetType === "negotiable" ? "A negociar" : budgetValue,
      deadline,
      hashtags,
      userId: user?.id
    };

    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/')
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white p-6 gap-6">
      {/* Formulário */}
      <div className="p-6 lg:h-[500px] w-full lg:w-1/2 bg-gradient-to-b from-gray-900 via-purple-800 to-black rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Criar Projeto</h1>
        <div className="space-y-4 p-2 lg:scroll-y-auto lg:overflow-y-auto h-5/6">
          {/* Título */}
          <input
            type="text"
            placeholder="Título do Projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          />

          {/* Descrição */}
          <textarea
            placeholder="Descrição do projeto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          />

          {/* Tipo de Orçamento */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Orçamento</h3>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-400"
            >
              <option value="negotiable">A negociar</option>
              <option value="total">Especificar orçamento</option>
            </select>
            {budgetType !== "negotiable" && (
              <input
                type="number"
                placeholder="Valor do orçamento"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
              />
            )}
          </div>

          {/* Prazo */}
          <div>
            <h3 className="text-lg font-semibold">Prazo</h3>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Hashtags */}
          <div>
            <h3 className="text-lg font-semibold">Categorias (Hashtags)</h3>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Adicionar hashtag"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleAddHashtag}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                <IoMdAdd />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {hashtags.map((hashtag, idx) => (
                <div
                  key={idx}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  #{hashtag}
                  <button
                    onClick={() => handleRemoveHashtag(hashtag)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <button
            onClick={handlePublishProject}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
          >
            Publicar Projeto
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-6 hidden lg:block lg:w-1/2 h-[500px] bg-gradient-to-b from-gray-900 via-purple-800 to-black rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Preview do Projeto</h2>
        <div className="p-4 bg-gray-900 rounded-2xl w-full">

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{title || "Título do Projeto"}</h3>
            <p className="text-gray-400">{description || "Descrição do projeto aparecerá aqui."}</p>
            <p className="text-gray-300">
              <span className="font-semibold">Orçamento:</span>{" "}
              {budgetType === "negotiable"
                ? "A negociar"
                : budgetValue
                  ? `R$ ${budgetValue}`
                  : "Não especificado"}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Prazo:</span>{" "}
              {deadline || "Não especificado"}
            </p>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg"
                >
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
