import { Link } from "react-router-dom";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { toast } from "react-toastify";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";


const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório!"),
    email: z.string().email("Insira um e-mail válido!").nonempty("O campo e-mail é obrigatório!"),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres").nonempty("O campo senha é obnigatório!"),
});

type FormData = z.infer<typeof schema>

export function Register() {

    const { handleInfoUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    //Deslogar o usuário caso acesse a página de registro
    useEffect(() => {
        async function handleLogout() {
            await signOut(auth);
        }
        handleLogout();

    }, []);

    async function onSubmit(data: FormData) {
        //console.log(data);
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (user) => {
                await updateProfile(user.user, {
                    displayName: data.name,
                });
                handleInfoUser({
                    name: data.name,
                    email: data.email,
                    uid: user.user.uid,
                });
                toast.success("Usuário registrado com sucesso!");
                navigate("/dashboard", { replace: true });
            }).catch((error) => {
                console.error(error);
                toast.error("Erro ao cadastrar usuário, tente novamente...")
            })
    }

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to="/">
                    <h3 className="text-2xl text-zinc-600 font-bold">WP Veículos</h3>
                </Link>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl w-full rounded-lg p-4">

                    <div className="mb-3">
                        <Input
                            type="text"
                            placeholder="Digite seu nome completo"
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>

                    <div className="mb-3">
                        <Input
                            type="email"
                            placeholder="Digite seu e-mail"
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className="mb-3">
                        <Input
                            type="password"
                            placeholder="Digite sua senha"
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>

                    <div className="w-full flex justify-center items-center my-2">
                        <button className="w-full cursor-pointer bg-zinc-600 text-white p-2 text-sm rounded-md hover:bg-zinc-700 transition-all" type="submit">Registrar</button>
                    </div>
                </form>

                <div>
                    <Link to="/login">
                        <span className="text-sm text-zinc-600">Já possui uma conta? Faça login</span>
                    </Link>
                </div>
            </div>

        </Container>
    )
}