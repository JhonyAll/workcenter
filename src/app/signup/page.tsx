import React from "react";
import logo from '@/assets/img/logo.svg'
import SignIn from "@/components/SignIn";
import Image from "next/image";
import styles from './styles.module.css'
import SignUpBox from "@/components/SignUpBox";


const SignUpPage = () => {
   return (
    <div className="w-screen h-max-screen h-screen grid grid-cols-7 justify-center items-center">
      <SignUpBox />
      <div className={"z-10 col-span-3 lg:col-span-4 bg-gray-50 hidden md:flex flex-col justify-center items-center h-full w-full gap-5 " + styles.bg}>
        <Image src={logo} alt="Workcenter logo" className="w-4/5" />
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-4">Crie sua Conta!</h1>
        <p className="text-sm lg:text-base font-medium text-justify px-8 lg:px-20">Junte-se à nossa comunidade e comece sua jornada como freelancer ou encontre os profissionais ideais para os seus projetos. Ao se cadastrar, você terá acesso a uma variedade de oportunidades, poderá compartilhar seu talento e conectar-se com pessoas que valorizam o seu trabalho. Vamos construir juntos um futuro promissor!</p>
      </div>
    </div>
  );
};

export default SignUpPage;
