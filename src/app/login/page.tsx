import React from "react";
import logo from '@/assets/img/logo.svg'
import SignIn from "@/components/SignInBox";
import Image from "next/image";
import styles from './styles.module.css'


const LoginPage = () => {
   return (
    <div className="w-screen h-max-screen h-screen grid grid-cols-7 justify-center items-center">
      <div className={"col-span-3 lg:col-span-4 bg-gray-50 hidden md:flex flex-col justify-center items-center h-full w-full gap-5 " + styles.bg}>
        <Image src={logo} alt="Workcenter logo" className="w-4/5" />
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4 text-white">Bem-vindo!</h1>
        <p className="text-sm lg:text-base font-medium text-justify px-8 lg:px-20 text-white">Conecte-se à sua conta e continue construindo sua carreira como freelancer ou encontrando os profissionais perfeitos para o seu projeto. Explore oportunidades, compartilhe seu talento e faça parte de uma comunidade que valoriza o seu trabalho.</p>
      </div>
      <SignIn/>
    </div>
  );
};

export default LoginPage;
