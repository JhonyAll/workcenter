"use client";

import { useState } from "react";
import InputComponent from "@/components/Input";
import Link from "next/link";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import styles from './styles.module.css';

export default function SignUpBox() {
    const [nameValue, setNameValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const handleButtonClick = () => {
        setShowPasswordFields(prev => !prev);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode fazer o login ou o que for necessário
        console.log({ nameValue, emailValue, passwordValue, confirmPasswordValue });
    };

    return (
        <form className="form-signIn col-span-7 md:col-span-4 lg:col-span-3 border-l border-gray-700 bg-gray-900 text-gray-50 w-full h-full px-16 sm:px-32 md:px-14 shadow-xl flex flex-col justify-center align-center gap-20" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-center">Criar Conta</h1>

            <div className="text-zinc-200">
                <div className="flex flex-col gap-6">
                    <div className={"w-full h-14 relative transition-transform duration-500"}>
                        <InputComponent
                            name="name"
                            text="Nome e sobrenome"
                            typeInput="text"
                            changeState={setNameValue}
                            state={nameValue}
                        />
                    </div>
                    <div className={"w-full h-14 relative transition-transform duration-500"}>
                        <InputComponent
                            name="email"
                            text="E-mail"
                            bgColor="bg-gray-900"
                            typeInput={"text"}
                            state={emailValue}
                            changeState={setEmailValue}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-20">
                <div className="w-full flex justify-center items-center">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className={`bg-purple-500 font-bold select-none h-14 rounded-xl hover:bg-transparent border-solid border border-transparent hover:border-slate-700 transition-all hover:bg-transparent p-6 flex justify-center items-center`}
                    >
                        <MdOutlineSubdirectoryArrowRight size={26} />
                    </button>
                </div>

                <p className="text-gray-50 text-sm select-none">
                    {`Já possui uma conta? `}
                    <Link href="/login">
                        <span className="cursor-pointer hover:text-purple-300">
                            Entrar
                        </span>
                    </Link>
                </p>
            </div>
        </form>
    );
}
