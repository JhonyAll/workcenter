"use client";

import { useState } from "react";
import { IoIosClose } from "react-icons/io";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [preview, setPreview] = useState(false)

  const handleViewPreview = () => {
    setPreview(!preview)
  }

  const handleAddLink = () => {
    if (newLink.trim() && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (link: string) => {
    setLinks(links.filter((l) => l !== link));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      setMedia([...media, ...Array.from(files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleMediaUpload(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white p-4 pb-40 gap-10">
      {/* Editor */}
      <div className="lg:w-1/2 w-full lg:h-[500px] p-8 bg-gradient-to-b from-gray-900 via-purple-800 to-black rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Criar Post</h1>
        <div className="space-y-6 lg:scroll-y-auto lg:overflow-y-auto h-5/6 pr-2">
          {/* Título */}
          <input
            type="text"
            placeholder="Título do Post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          />

          {/* Descrição */}
          <textarea
            placeholder="Escreva uma descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          />

          {/* {Links } */}
          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold">Links</h3>
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="text"
                placeholder="Adicionar link (ex: https://meusite.com)"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleAddLink}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap mt-4 gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 text-purple-400 px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                  <button
                    onClick={() => handleRemoveLink(link)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-lg font-semibold">Categorias (Hashtags)</h3>
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
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap mt-4 gap-2">
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-purple-500"
                  onClick={() => handleRemoveCategory(category)}
                >
                  #{category}
                </span>
              ))}
            </div>
          </div>

          {/* Upload de Mídia */}
          <div>
            <h3 className="text-lg font-semibold">Imagens e Vídeos</h3>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center hover:border-purple-300"
            >
              <p className="text-gray-400">Arraste e solte arquivos aqui ou clique abaixo</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleMediaUpload(e.target.files)}
                className="mt-4 text-purple-400"
              />
            </div>
          </div>

          {/* Código Incorporado */}
          <div>
            <h3 className="text-lg font-semibold">Código Incorporado</h3>
            <textarea
              placeholder="<Seu código aqui>"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <button
              onClick={handleViewPreview}
              className="block mb-4 lg:hidden bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
            >
              Visualizar Preview
            </button>
            <button
              onClick={handleAddCategory}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
            >
              Publicar Post
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className={`lg:w-1/2 min-h-[500px] p-6 bg-gradient-to-b from-gray-900 via-purple-800 to-gray-900 rounded-2xl lg:block ${preview ? ' w-5/6 absolute top-[60%] z-20 left-[50%] shadow-3xl translate-y-[-50%] translate-x-[-50%] border border-white' : 'hidden'}`}>
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6 text-purple-400">Preview</h1>
          <button className="text-3xl font-bold mb-6 text-purple-400 lg:hidden" onClick={handleViewPreview}><IoIosClose size={40} /></button>
        </div>
        <div className="space-y-6 p-4 bg-gray-900 rounded-lg">
          <h1 className="text-3xl font-bold text-purple-400">{title || "Título do Post"}</h1>
          <p className="mt-4 text-justify break-words whitespace-pre-wrap">{description || "Adicione uma descrição..."}</p>

          {links.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-purple-400">Links</h3>
              <ul className="list-disc list-inside">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {categories.length > 0 && (
            <div className="flex flex-wrap mt-4 gap-2">
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  #{category}
                </span>
              ))}
            </div>
          )}
          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {media.map((file, idx) => (
                <div key={idx} className="relative">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`media-${idx}`}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {codeSnippet && (
            <pre className="mt-4 bg-gray-800 p-4 rounded-lg overflow-auto">
              <code>{codeSnippet}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
