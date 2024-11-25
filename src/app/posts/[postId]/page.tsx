'use client'

import { useEffect, useState } from "react"
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

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

const PostPage = ({
  params,
}: {
  params: Promise<{ postId: string }>
}) => {
  const [post, setPost] = useState<PostWithRelations | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const { postId } = await params
      await fetch(`/api/posts/${postId}`).then(response => response.json()).then(responseJson => setPost(responseJson.data.post))
    }
    fetchPost()
  }, [])

  return (
    <div>
      {post ? (
        <div className="p-4 pt-10 rounded-lg flex flex-col gap-8">
          <div>

            <Link href={`/user/${post.author.id}`} className="flex gap-4 items-center">
            {!(post.author.profilePhoto === 'N/A') ? (
              <Image
                src={post.author.profilePhoto}
                className="rounded-full border-2 border-purple-500"
                alt="Profile"
                width={50}
                height={50}
              />
            ) : (
              <FaUserCircle size={50} color="#A3A3A3" />
            )}
              <p className="font-medium text-lg">{post.author.username}</p>
            </Link>
            <span className="text-gray-500 text-sm mt-4">Data de publicação: {post.createdAt.toString()}</span>
          </div>
          <h1 className="text-4xl text-purple-400 font-extrabold  text-center">{post.title}</h1>


          <p className="mt-12 text-justify break-words whitespace-pre-wrap">{post.description}</p>
          <div className="md:grid-cols-3 md:grid gap-3 col-span-2">
            {post.gallery.map((media, indx) => media.includes(".mp4") || media.includes(".webm") ? (<video
              controls
              width={500} height={500}
              className="object-cover rounded-xl"
              key={indx}
            >
              <source src={media} type="video/mp4" />
              Seu navegador não suporta a reprodução de vídeo.
            </video>) : (<Image
              key={indx}
              src={media}
              width={500} height={500} className="rounded-xl object-cover "
              alt=""
            />))
            }
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap mt-4 gap-2">
              {
                post.hashtags.map((hashtag, indx) => (<Link key={indx}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm"
                  href={`/categories/${hashtag.id}`}
                >
                  #{hashtag.name}
                </Link>))
              }
            </div>
            <div className="mt-4">
              <ul className="list-disc list-inside">
                {
                  post.links.map((link, indx) => (<li key={indx}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">
                      {link}
                    </a>
                  </li>))
                }
              </ul>
            </div>
          </div>
          <div>
            {
              post.embedCode && (<><h1 className="font-bold text-lg">Código Anexo</h1>
                <pre className="mt-4 bg-gray-800 p-4 rounded-lg overflow-auto">
                  <code>{post.embedCode}</code>
                </pre></>)
            }

          </div>
        </div>) : (<div className="p-4 pt-10 rounded-lg flex flex-col gap-8 animate-pulse">
          {/* Título do post */}
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>

          {/* Parágrafo */}
          <div className="space-y-2 mt-12">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>

          {/* Imagem */}
          <div className="h-64 bg-gray-300 rounded w-full"></div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>

          {/* Links */}
          <div className="mt-4">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>

          {/* Código anexo */}
          <div>
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostPage