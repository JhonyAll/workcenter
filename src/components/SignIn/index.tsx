"use client";

import { useState } from "react";
import InputComponent from "@/components/Input";
import ButtonComponent from "@/components/Button";
import Link from "next/link";
import { PiEye, PiEyeSlash } from "react-icons/pi";
import Image from "next/image";
import planetLogo from '@/assets/img/planet-logo.svg'
import { redirect } from "next/navigation";

export default function SignIn() {
    const [reveledPassword, setReveledPassword] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const handleLogin = async (usernameOrEmail: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data)
            } else {
                return console.error('Erro ao fazer login', data.message);
            }
        } catch (error) {
            return console.error('Erro ao fazer login', error);
        }

        return redirect('/')
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(emailValue, passwordValue)
    }

    return (
        <form className="form-signIn col-span-7 md:col-span-4 lg:col-span-3 border-l border-gray-700 bg-gray-900 text-gray-50 w-full h-full px-16 sm:px-32 md:px-14 shadow-xl flex flex-col justify-center align-center gap-20" onSubmit={handleSubmit}>
            <Image src={planetLogo} alt="" />
            <h1 className="text-4xl font-bold text-center">Entrar</h1>

            <div className="text-zinc-200 flex flex-col gap-6">
                <div className="w-full h-14 relative">
                    <InputComponent
                        name="email"
                        text="Email ou Username"
                        typeInput="text"
                        changeState={setEmailValue}
                        state={emailValue}
                    />
                </div>
                <div className="w-full h-14 relative">
                    <InputComponent
                        name="password"
                        text="Senha"
                        bgColor="bg-gray-900"
                        typeInput={reveledPassword ? "text" : "password"}
                        state={passwordValue}
                        changeState={setPasswordValue}
                    />
                    <span className="mr-2 absolute right-0 translate-y-[-50%] top-2/4">
                        {reveledPassword ? (
                            <PiEyeSlash
                                className="text-lg cursor-pointer"
                                onClick={() => setReveledPassword(!reveledPassword)}
                            />
                        ) : (
                            <PiEye
                                className="text-lg cursor-pointer"
                                onClick={() => setReveledPassword(!reveledPassword)}
                            />
                        )}
                    </span>
                    <span className="text-gray-50 text-xs cursor-pointer select-none hover:text-purple-300">
                        Eu esqueci minha senha
                    </span>
                </div>
            </div>
            <div>
                <ButtonComponent
                    text="Entrar"
                    bgColor="bg-purple-500"
                    textColor=""
                    hoverBgColor="bg-purple-600"
                    buttonSubmit={true}
                />

                <p className="text-gray-50 text-sm select-none mt-4">
                    {`Não possui uma conta? `}
                    <Link href="/signup">
                        <span className="cursor-pointer hover:text-purple-300">
                            Cadastrar-se
                        </span>
                    </Link>
                </p>
            </div>
        </form>
    )
}
