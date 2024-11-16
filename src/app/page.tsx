'use client'
import CreateMenuButton from "@/components/CreateMenuButton";
// pages/home.tsx
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

const Home = () => {
  // Simulação de dados
  const posts = [
    { 
      title: "Como começar no desenvolvimento web", 
      author: "João", 
      date: "10 de Outubro", 
      content: "Dicas valiosas para iniciantes...", 
      image: "/images/web-development.jpg" 
    },
    { 
      title: "Trabalhando como freelancer em 2024", 
      author: "Maria", 
      date: "15 de Outubro", 
      content: "Estratégias para conquistar clientes...", 
      image: "/images/freelancing.jpg" 
    },
    { 
      title: "Melhores ferramentas de design", 
      author: "Lucas", 
      date: "17 de Outubro", 
      content: "Ferramentas indispensáveis...", 
      image: "/images/design-tools.jpg" 
    },
  ];

  const projects = [
    { title: "Desenvolvimento de Site para Restaurante", description: "Desenvolvimento de um site para um restaurante local.", budget: "R$ 2.500", skills: ["HTML", "CSS", "JavaScript"] },
    { title: "App para Delivery de Comida", description: "App para facilitar pedidos e entregas.", budget: "R$ 5.000", skills: ["React", "Node.js"] },
    { title: "Criação de Logo para Startup", description: "Design de logo e identidade visual.", budget: "R$ 1.000", skills: ["Design", "Adobe Suite"] },
  ];

  const workers = [
    { name: "Carlos", jobTitle: "Desenvolvedor Front-end", location: "São Paulo", rating: 4.8 },
    { name: "Ana", jobTitle: "Designer Gráfico", location: "Rio de Janeiro", rating: 4.5 },
    { name: "Fernanda", jobTitle: "Redatora", location: "Belo Horizonte", rating: 4.9 },
  ];

  return (
    <div className="flex flex-col gap-16 mt-16">
      <CreateMenuButton />
      {/* Seção de Posts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Postagens Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold text-purple-500">{post.title}</h3>
              <p className="text-sm text-gray-400">{post.content.substring(0, 100)}...</p>
              <div className="mt-2 text-xs text-gray-500">
                <span>{post.author}</span> • <span>{post.date}</span>
              </div>
              <Link href={`/posts/${index}`} className="text-purple-500 text-sm mt-2 block">Leia mais</Link>
            </div>
          ))}
        </div>
        <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4">Ver Mais</button>
      </section>

      {/* Seção de Projetos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Sugestões de Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-purple-500">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-bold">Orçamento:</span> {project.budget}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-bold">Habilidades:</span> {project.skills.join(", ")}
              </div>
              <Link href={`/projects/${index}`} className="text-purple-500 text-sm mt-2 block">Ver Projeto</Link>
            </div>
          ))}
        </div>
        <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4">Ver Mais</button>
      </section>

      {/* Seção de Freelancers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Freelancers Sugeridos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3">
                <FaUserCircle size={50} className="text-gray-300" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-500">{worker.name}</h3>
                  <p className="text-sm text-gray-400">{worker.jobTitle}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-bold">Localização:</span> {worker.location}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-bold">Avaliação:</span> {worker.rating} ⭐
              </div>
              <Link href={`/workers/${index}`} className="text-purple-500 text-sm mt-2 block">Ver Perfil</Link>
            </div>
          ))}
        </div>
        <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4">Ver Mais</button>
      </section>
    </div>
  );
};

export default Home;
