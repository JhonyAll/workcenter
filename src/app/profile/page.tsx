"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiOutlinePhone, AiOutlineMail, AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import { BsFillStarFill } from "react-icons/bs";
import Modal from "react-modal";

// Tipagem para o tipo do portfólio
interface PortfolioItem {
  name: string;
  description: string;
  imageUrl: string;
  link: string;
}

const WorkerProfilePage = () => {
  // Estado para o perfil do trabalhador
  const [worker, setWorker] = useState({
    name: "Carlos Silva",
    profession: "Programador Web",
    bio: "Desenvolvedor full-stack com 5 anos de experiência em desenvolvimento de sistemas e aplicativos web. Apaixonado por código limpo e projetos inovadores.",
    phone: "(11) 98765-4321",
    email: "carlos.silva@email.com",
    socialLinks: {
      instagram: "https://instagram.com/carlosdev",
      linkedin: "https://linkedin.com/in/carlosdev",
    },
    skills: ["JavaScript", "React", "Node.js", "CSS", "Python"],
    completedTasks: 15,
    rating: 4.8,
    portfolio: [
      { name: "Projeto X", description: "Sistema de gerenciamento de tarefas com funcionalidades avançadas de colaboração e produtividade.", imageUrl: "https://via.placeholder.com/300", link: "/projects/1" },
      { name: "Aplicativo Y", description: "Aplicativo móvel para gestão de dietas com recursos de personalização e rastreamento de nutrientes.", imageUrl: "https://via.placeholder.com/300", link: "/projects/2" },
    ],
  });

  // Estado para controle do modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<PortfolioItem | null>(null);

  // Função para abrir o modal
  const openModal = (project: PortfolioItem) => {
    setCurrentProject(project);
    setModalIsOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentProject(null);
  };

  // Função de contato (para envio de mensagem ou interação)
  const handleContact = () => {
    // Simulação de um envio de mensagem ou interação (aqui você pode fazer o que for necessário)
    alert("Mensagem enviada para " + worker.name);
  };

  const { user } = useUser()

  if(!user) return

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 pb-40">
      {/* Cabeçalho com imagem de capa e avatar */}
      <div className="relative">
        <img
          src="https://via.placeholder.com/1500x500/6b21a8/ffffff"
          alt="Capa"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-36 left-6">
          <Image
            src={user.profilePhoto}
            alt="Avatar"
            width={128}
            height={128}
            className="rounded-full border-4 border-purple-600"
          />
        </div>
      </div>

      {/* Informações do Perfil */}
      <div className="mt-32 px-6">
        <h1 className="text-3xl font-semibold">{user.name}</h1>
        <h2 className="text-xl text-gray-400 mb-4">{worker.profession}</h2>

        {/* Descrição sobre o trabalhador */}
        <div className="bg-gradient-to-r from-gray-900 via-purple-600 to-purple-900 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Sobre Mim</h3>
          <p>{worker.bio}</p>
        </div>

        {/* Avaliação do trabalhador */}
        <div className="flex items-center mb-4">
          <BsFillStarFill className="text-yellow-400 text-lg" />
          <span className="ml-2 text-xl">{worker.rating}</span>
          <span className="text-gray-400 ml-2">({worker.completedTasks} tarefas concluídas)</span>
        </div>

        {/* Habilidades */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-gray-900 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Habilidades</h3>
          <ul className="flex flex-wrap gap-3">
            {worker.skills.map((skill, index) => (
              <li key={index} className="bg-purple-600 text-white px-4 py-2 rounded-full">{skill}</li>
            ))}
          </ul>
        </div>

        {/* Informações de Contato */}
        <div className="bg-gradient-to-b from-purple-700 via-purple-800 to-gray-900 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Informações de Contato</h3>
          <div className="flex items-center mb-2">
            <AiOutlinePhone className="text-purple-400 text-lg" />
            <span className="ml-4">{worker.phone}</span>
          </div>
          <div className="flex items-center mb-2">
            <AiOutlineMail className="text-purple-400 text-lg" />
            <span className="ml-4">{worker.email}</span>
          </div>
          <div className="flex items-center mb-2">
            <AiOutlineInstagram className="text-purple-400 text-lg" />
            <a href={worker.socialLinks.instagram} className="ml-4 text-purple-400 hover:underline">
              {worker.socialLinks.instagram}
            </a>
          </div>
          <div className="flex items-center mb-2">
            <AiOutlineLinkedin className="text-purple-400 text-lg" />
            <a href={worker.socialLinks.linkedin} className="ml-4 text-purple-400 hover:underline">
              {worker.socialLinks.linkedin}
            </a>
          </div>
        </div>

        {/* Portfólio */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Portfólio</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {worker.portfolio.map((project, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg relative">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h4 className="text-xl font-semibold mb-2">{project.name}</h4>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <button
                  onClick={() => openModal(project)}
                  className="bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-500"
                >
                  Ver Mais
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Botão para contratar */}
        <button
          onClick={handleContact}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-500"
        >
          Enviar Mensagem
        </button>
      </div>
    </div>
  );
};

export default WorkerProfilePage;
