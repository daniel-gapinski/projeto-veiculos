import { ChangeEvent, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../../contexts/AuthContext";
import {v4 as uuidV4} from "uuid";
import { storage, db } from "../../../services/firebaseConnection";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import { FiTrash, FiUpload } from "react-icons/fi";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/dashboardHeader";
import { Input } from "../../../components/input";
import { TextArea } from "../../../components/textarea";
import { toast } from "react-toastify";

const schema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    model: z.string().nonempty("O modelo é obrigatório"),
    year: z.string().nonempty("O ano do veículo é obrigatório"),
    km: z.string().nonempty("O KM do veículo é obrigatório"),
    price: z.string().nonempty("O preço é obrigatório"),
    city: z.string().nonempty("A cidade é obrigatória"),
    whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Número de telefone inválido!"
    }),
    description: z.string().nonempty("A descrição é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
    uid: string;
    name: string;
    previewUrl:string;
    url: string;
}

export function New() {

    const { user } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const [ carImages, setCarImages ] = useState<ImageItemProps[]>([]);

    function onSubmit(data: FormData) {
        //console.log(data);

        if(carImages.length === 0) {
            toast.error("Insira pelo menos uma imagem para prosseguir!");
            return;
        }

        const carListImages = carImages.map( car => {
            return{
                uid: car.uid,
                name: car.name,
                url: car.url,
            }
        });

        addDoc(collection(db, "cars"), {
            name: data.name.toUpperCase(),
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.year,
            km: data.km,
            price: data.price,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages,
        }).then(() => {
            toast.success("Veículo cadastrado com sucesso!");
            reset();
            setCarImages([]);
        }).catch(() => {
            toast.error("Erro ao cadastrar veículo!");
            //console.log(err);
            //console.log("Erro ao cadastrar no banco!");
        }) 
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if(e.target.files && e.target.files[0]) {
            const image = e.target.files[0];
            //console.log(image)

            if(image.type === "image/jpeg" || image.type === "image/png") {
                //Enviar a imagem para o banco de dados
                await handleUpload(image);
                
            }else {
                toast.info("Envie uma imagem no formato JPEG ou PNG");
                return;
            }
        }
    }

    async function handleUpload(image: File) {
        if(!user?.uid) {
            return;
        }
        const currentUuid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUuid}/${uidImage}`);

        uploadBytes(uploadRef, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadUrl) => {
                //console.log(downloadUrl)
                const imageItem = {
                    name: uidImage,
                    uid: currentUuid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl,
                }

                setCarImages((images) => [...images, imageItem])
            });

            //toast.success("Imagem enviada com sucesso!");
        }).catch(() => {
            //console.log(error);
            //toast.error("Erro ao enviar imagem!");
            toast.error("Erro ao enviar imagem!");
        })
    }

    async function handleDeleteImage(item: ImageItemProps) {
        //console.log(item);
        const imagePath = `images/${item.uid}/${item.name}`

        const imageRef = ref(storage, imagePath);

        try{
            await deleteObject(imageRef);
            setCarImages(carImages.filter((car) => car.url !== item.url));
        }catch(err) {
            //console.log("Erro ao deletar imagem! ", err);
            toast.error("Erro ao deletar imagem. Tente novamente mais tarde!");
        }
    }

    return (
        <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-400 h-32">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={21} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFile}
                            className="opacity-0 cursor-pointer" />
                    </div>
                </button>
                {carImages.map(item => (
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button
                            onClick={() => handleDeleteImage(item)} 
                            className="bg-gray-400 p-2 rounded-lg text-red-500 absolute cursor-pointer hover:bg-gray-600 transition-all">
                            <FiTrash size={21} />
                        </button>
                        <img 
                            className="w-full rounded-lg h-32 object-cover"
                            src={item.previewUrl} 
                            alt="Imagem do veículo" />
                    </div>
                ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
                    <div className="mb-3">
                        <label className="mb-2 text-sm">Nome do veículo</label>
                        <Input
                            type="text"
                            placeholder="Ex.: Audi RS3"
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="mb-2 text-sm">Modelo do veículo</label>
                        <Input
                            type="text"
                            placeholder="Ex.: RS3"
                            name="model"
                            error={errors.model?.message}
                            register={register}
                        />
                    </div>

                    <div className="flex w-full mb-3 gap-4 items-center">
                        <div className="w-full">
                            <label className="mb-2 text-sm">Ano do veículo</label>
                            <Input
                                type="text"
                                placeholder="Ex.: 2019"
                                name="year"
                                error={errors.year?.message}
                                register={register}
                            />
                        </div>
                        <div className="w-full">
                            <label className="mb-2 text-sm">Quilometragem</label>
                            <Input
                                type="text"
                                placeholder="Ex.: 10.000"
                                name="km"
                                error={errors.km?.message}
                                register={register}
                            />
                        </div>
                    </div>

                    <div className="flex w-full mb-3 gap-4 items-center">
                        <div className="w-full">
                            <label className="mb-2 text-sm">Telefone</label>
                            <Input
                                type="text"
                                placeholder="(99) 99999-9999"
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                register={register}
                            />
                        </div>
                        <div className="w-full">
                            <label className="mb-2 text-sm">Cidade</label>
                            <Input
                                type="text"
                                placeholder="Ex.: Curitiba - PR"
                                name="city"
                                error={errors.city?.message}
                                register={register}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="mb-2 text-sm">Preço</label>
                        <Input
                            type="text"
                            placeholder="Ex.: R$ 159.999,99"
                            name="price"
                            error={errors.price?.message}
                            register={register}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="mb-2 text-sm">Descrição</label>
                        <TextArea
                            placeholder="Descrição completa do veículo..."
                            name="description"
                            error={errors.description?.message}
                            register={register}
                        />
                    </div>

                    <div className="w-full flex justify-center items-center my-2">
                        <button className="w-full cursor-pointer bg-zinc-600 text-white p-2 text-sm rounded-md hover:bg-zinc-700 transition-all" type="submit">Cadastrar</button>
                    </div>

                </form>
            </div>
        </Container>
    )
}