'use client'
import CreateMenuButton from "@/components/CreateMenuButton";
// pages/home.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import type { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    hashtags: true;
    author: {
      select: {
        id: true;
        username: true;
        profilePhoto: true;
      };
    };
  };
}>;

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    hashtags: true;
    author: {
      select: {
        id: true;
        username: true;
        profilePhoto: true;
      };
    };
  };
}>;

const Home = () => {
  const [posts, setPosts] = useState<PostWithRelations[] | null>(null)
  const [projects, setProjects] = useState<ProjectWithRelations[] | null>(null)

  const handleFetchRecentsPosts = async () => {
    const fetchApiPosts = await fetch('api/posts?quant=3', { credentials: 'include', next: { revalidate: 100 }, method: 'GET' })
      .then(response => response.json())
      .then(response => response.data.posts)

    setPosts(fetchApiPosts)
  }

  const handleFetchRecentsProjects = async () => {
    const fetchApiProjects = await fetch('api/project?quant=3', { credentials: 'include', next: { revalidate: 100 }, method: 'GET' })
      .then(response => response.json())
      .then(response => response.data.projects)

    setProjects(fetchApiProjects)
  }

  // Simulação de dados
  useEffect(() => {
    handleFetchRecentsPosts()
    handleFetchRecentsProjects()
  }, [])

  const postSs = [
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

  const projectSs = [
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
      {/* Seção de Posts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Postagens Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!posts || posts.length === 0 ? (
            // Renderiza três skeletons enquanto `posts` está vazio ou indefinido
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-zinc-800 p-4 rounded-lg shadow-lg transition-shadow flex flex-col justify-between animate-pulse"
              >
                <div className="w-full h-40 bg-zinc-700 rounded-lg mb-3" />
                <div>
                  <div className="h-5 bg-zinc-700 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-zinc-700 rounded w-full" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="h-3 bg-zinc-700 rounded w-1/3 mb-1" />
                  <div className="h-3 bg-zinc-700 rounded w-1/4" />
                </div>
                <div className="h-4 bg-zinc-700 rounded mt-4 w-1/5" />
              </div>
            ))
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
                {post.gallery[0] ? (
                  post.gallery[0].includes(".mp4") || post.gallery[0].includes(".webm") ? ( // Verifica se é vídeo
                    <video
                      controls
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    >
                      <source src={post.gallery[0]} type="video/mp4" />
                      Seu navegador não suporta a reprodução de vídeo.
                    </video>
                  ) : (
                    <img
                      src={post.gallery[0]}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-zinc-700 rounded-lg mb-3 text-gray-500">
                    Sem mídia
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-purple-500">{post.title}</h3>
                  <p className="text-sm text-gray-400">{post.description.substring(0, 100)}...</p>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>{post.author.username}</span> • <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/posts/${post.id}`} className="text-purple-500 text-sm mt-2 block">Leia mais</Link>
              </div>
            ))
          )}

        </div>
        <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg mt-4">Ver Mais</button>
      </section>

      {/* Seção de Projetos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Projetos Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.map((project, index) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-purple-500">{project.title}</h3>
              <p className="text-sm text-gray-400">{project.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-bold">Orçamento:</span> {project.budget === 'A negociar' ? project.budget : "R$ " + project.budget}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="font-bold">Categorias:</span> {project.hashtags.map((h, index) => <Link key={index} className="bg-purple-700 mr-2 py-1 px-2 text-white rounded-3xl" href={`/categories/${h.id}`}>#{h.name}</Link>)}
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
