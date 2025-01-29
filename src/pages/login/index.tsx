import { Link } from "react-router-dom";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { toast } from "react-toastify";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

const schema = z.object({
    email: z.string().email("Insira um e-mail válido!").nonempty("O campo e-mail é obrigatório"),
    password: z.string().nonempty("O campo senha é obnigatório!"),
});

type FormData = z.infer<typeof schema>

export function Login() {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    //Deslogar o usuário caso acesse a página de login
    useEffect(() => {
        async function handleLogout() {
            await signOut(auth);
        }
        handleLogout();

    }, []);

    function onSubmit(data: FormData) {
        //console.log(data);
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user) => {
            toast.success("Bem-vindo(a)!");
            navigate("/dashboard", { replace: true });
            console.log(user)

        }).catch((err) => {
            console.log(err);
            toast.error("E-mail ou senha incorretos!")
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
                        <button className="w-full cursor-pointer bg-zinc-600 text-white p-2 text-sm rounded-md hover:bg-zinc-700 transition-all" type="submit">Acessar</button>
                    </div>

                </form>

                <div>
                    <Link to="/register">
                        <span className="text-sm text-zinc-600">Ainda não possui uma conta? Registre-se</span>
                    </Link>
                </div>
            </div>

        </Container>
    )
}