'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputComponent from "@/components/Input";
import Link from "next/link";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { FaUserTie, FaUsers } from "react-icons/fa";
import styles from './styles.module.css';
import ButtonComponent from "../Button";
import ImageCropper from "@/components/CropperImage";
import handleUpload from "@/utils/uploadForFirebase";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

export default function SignUpBox() {
    const [nameValue, setNameValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showProfileFields, setShowProfileFields] = useState(false);
    const [showWorkerFields, setShowWorkerFields] = useState(false);
    const [showAccountType, setShowAccountType] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>('client');
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [submitingButton, setSubmittingButton] = useState(false)
    const [profession, setProfession] = useState("");
    const [newSkills, setNewSkills] = useState<string>('')
    const [skills, setSkills] = useState<string[]>([])

    const { refreshUser } = useUser()

    const router = useRouter();

    const handleAddSkill = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (newSkills.trim() && !skills.includes(newSkills)) {
            setSkills([...skills, newSkills]);
            setNewSkills("");
        }
        console.log(skills)
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter((cat) => cat !== skill));
    };

    useEffect(() => {
        if (selectedOption === 'client' || showWorkerFields) {
            setSubmittingButton(true)
        } else {
            setSubmittingButton(false)
        }
    }, [selectedOption])

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setErrors([]);
        const validationErrors = handleValidation();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!showPasswordFields) {
            setShowPasswordFields(true);
        } else if (!showProfileFields) {
            setShowProfileFields(true);
        } else if (!showAccountType) {
            setShowAccountType(true);
        } else if (!showWorkerFields) {
            setShowWorkerFields(true)
            setSubmittingButton(true)
        }
    };

    const handleValidation = () => {
        const validationErrors: string[] = [];

        if (!nameValue.trim()) {
            validationErrors.push("Nome e sobrenome são obrigatórios.");
        }
        if (!emailValue.trim()) {
            validationErrors.push("E-mail é obrigatório.");
        }
        if (showPasswordFields && passwordValue !== confirmPasswordValue) {
            validationErrors.push("As senhas não coincidem.");
        }
        if (showProfileFields && !usernameValue.trim()) {
            validationErrors.push("Nome de usuário é obrigatório.");
        }

        return validationErrors;
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        let urlImage = "N/A"
        if (croppedImage) urlImage = await handleUpload(croppedImage)

        setIsSubmitting(true);

        const skillsArray = skills.map(skill => ({ name: skill }));

        const body = {
            username: usernameValue,
            password: passwordValue,
            type: selectedOption?.toUpperCase(),
            name: nameValue,
            email: emailValue,
            profilePhoto: urlImage || "N/A",
            profession: profession,
            skills: skillsArray
        };

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (response.ok) {
                router.push('/')
                await refreshUser()
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            alert('Erro ao criar usuário. Tente novamente.');
        } finally {
            setIsSubmitting(false);

        }
    };

    return (
        <form className="form-signIn col-span-7 md:col-span-4 lg:col-span-3 border-l border-gray-700 bg-gray-900 text-gray-50 w-full h-full px-16 py-16 sm:px-32 md:px-14 shadow-xl overflow-hidden" onSubmit={(e) => {
            e.preventDefault();
            console.log("BBBBBBBBBBBB")
            handleSubmit();
        }}>
            <h1 className="text-4xl font-bold text-center mb-8">Criar Conta</h1>
            <div className="flex flex-col justify-center align-center gap-10 w-full h-full flex-grow">
                {errors.length > 0 && (
                    <div className="text-red-500 bg-red-900 p-4 rounded-md mb-6">
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="text-zinc-200 flex flex-col gap-6">
                    <AnimatePresence>
                        {!showPasswordFields && !showProfileFields && !showAccountType && (
                            <>
                                <motion.div
                                    key="name"
                                    className="w-full h-14 relative"
                                    initial={{ x: 0, opacity: 1 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <InputComponent
                                        name="name"
                                        text="Nome e sobrenome"
                                        typeInput="text"
                                        changeState={setNameValue}
                                        state={nameValue}
                                    />
                                </motion.div>

                                <motion.div
                                    key="email"
                                    className="w-full h-14 relative"
                                    initial={{ x: 0, opacity: 1 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <InputComponent
                                        name="email"
                                        text="E-mail"
                                        bgColor="bg-gray-900"
                                        typeInput="text"
                                        changeState={setEmailValue}
                                        state={emailValue}
                                    />
                                </motion.div>
                            </>
                        )}

                        {showPasswordFields && !showProfileFields && !showAccountType && (
                            <>
                                <motion.div
                                    key="password"
                                    className="w-full h-14 relative"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <InputComponent
                                        name="password"
                                        text="Senha"
                                        typeInput="password"
                                        changeState={setPasswordValue}
                                        state={passwordValue}
                                    />
                                </motion.div>

                                <motion.div
                                    key="confirmPassword"
                                    className="w-full h-14 relative"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <InputComponent
                                        name="confirmPassword"
                                        text="Confirmar Senha"
                                        typeInput="password"
                                        changeState={setConfirmPasswordValue}
                                        state={confirmPasswordValue}
                                    />
                                </motion.div>
                            </>
                        )}

                        {showProfileFields && !showAccountType && (
                            <>
                                <motion.div
                                    key="profileFields"
                                    className="w-full flex flex-col items-center gap-6 pb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <p className="text-center font-bold">Foto de Perfil</p>
                                    <ImageCropper onImageCropped={setCroppedImage} />
                                </motion.div>
                                <motion.div
                                    key="username"
                                    className="w-full h-14 relative"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <InputComponent
                                        name="username"
                                        text="Nome de usuário"
                                        typeInput="text"
                                        changeState={setUsernameValue}
                                        state={usernameValue}
                                    />
                                </motion.div>
                            </>
                        )}

                        {showAccountType && !showWorkerFields && (
                            <motion.div
                                key="accountType"
                                className="w-full flex flex-col items-center mt-16 gap-6 pb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-xl text-center text-gray-300 mb-6">
                                    Escolha que tipo de conta você deseja
                                </h2>

                                <div className="flex justify-between w-full px-12 gap-8">
                                    <div
                                        className={`flex flex-col items-center text-gray-300 p-6 rounded-lg border transition-all cursor-pointer ${selectedOption === "worker"
                                            ? "border-purple-500"
                                            : "border-transparent hover:border-gray-600"
                                            }`}
                                        onClick={() => handleOptionClick("worker")}
                                    >
                                        <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                                            <FaUserTie size={28} color="white" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Worker</h3>
                                        <p className="text-sm text-justify mt-2">Como trabalhador, você poderá oferecer seus serviços e ser encontrado por clientes em busca de profissionais qualificados.</p>
                                    </div>

                                    <div
                                        className={`flex flex-col items-center text-gray-300 p-6 rounded-lg border transition-all cursor-pointer ${selectedOption === "client"
                                            ? "border-blue-500"
                                            : "border-transparent hover:border-gray-600"
                                            }`}
                                        onClick={() => handleOptionClick("client")}
                                    >
                                        <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                                            <FaUsers size={28} color="white" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Client</h3>
                                        <p className="text-sm text-justify mt-2">Como cliente, você terá acesso a uma vasta gama de profissionais para contratar, garantindo qualidade e confiabilidade.</p>
                                    </div>
                                </div>
                            </motion.div>

                        )
                        }
                        {showWorkerFields && (
                            <>
                                <motion.div key="profession" className="w-full h-14 relative">
                                    <InputComponent name="profession" text="Profissão" typeInput="text" changeState={setProfession} state={profession} />
                                </motion.div>

                                <div>
                                    <h3 className="text-lg font-semibold">Habilidades</h3>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Adicionar habilidade"
                                            value={newSkills}
                                            onChange={(e) => setNewSkills(e.target.value)}
                                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap mt-4 gap-2">
                                        {skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-purple-500"
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col gap-20 mt-6">
                    <div className="w-full flex justify-center items-center">
                        {
                            (showAccountType && submitingButton) ? <button
                                type="submit"
                                className={`bg-purple-500 font-bold select-none h-14 rounded-xl hover:bg-transparent border-solid border border-transparent hover:border-slate-700 transition-all p-6 flex justify-center items-center`}
                            >Criar Conta</button> : <button
                                type="button"
                                onClick={handleButtonClick}
                                className={`bg-purple-500 font-bold select-none h-14 rounded-xl hover:bg-transparent border-solid border border-transparent hover:border-slate-700 transition-all p-6 flex justify-center items-center`}
                                disabled={isSubmitting}
                            >
                                <MdOutlineSubdirectoryArrowRight size={26} />
                            </button>
                        }

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
            </div>
        </form>
    );
}
