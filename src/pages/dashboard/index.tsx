import { useState, useEffect } from "react";
import { collection, query, getDocs, where, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { ref, deleteObject } from "firebase/storage";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/dashboardHeader";

import { FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";

export function Dashboard() {

    interface CarsProps {
        id: string;
        name: string;
        price: string | number;
        km: string;
        year: string;
        city: string;
        uid: string;
        images: CarImageProps[];
    }

    interface CarImageProps {
        name: string;
        uid: string;
        url: string;
    }

    const [cars, setCars] = useState<CarsProps[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        function loadCars() {
            if (!user?.uid) {
                return;
            }

            const carsRef = collection(db, "cars");
            const queryRef = query(carsRef, where("uid", "==", user.uid));

            getDocs(queryRef).then((snapshot) => {
                //console.log(snapshot.docs);
                let listCars = [] as CarsProps[];

                snapshot.forEach(doc => {
                    listCars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid,
                    })
                })
                //console.log("Lista dos veículos referentes ao id do usuário: ", listCars);
                setCars(listCars);
            })
        }
        loadCars();
    }, [user]);

    async function handleDeleteCar(car: CarsProps) {
        //console.log(id);

        const itemCar = car;

        const docRef = doc(db, "cars", itemCar.id);
        await deleteDoc(docRef);

        itemCar.images.map( async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`;
            const imageRef = ref(storage, imagePath);

            try{
                await deleteObject(imageRef);
                setCars(cars.filter(car => car.id !== itemCar.id));
            }catch(err){
                console.error("Erro ao deletar esta imagem: " + err);
            }
        })
        toast.success("Veículo deletado com sucesso!");
    }


    return (
        <Container>
            <DashboardHeader />

            <main className="grid grid-cols-1 gap-6 md:grid-cols.2 lg:grid-cols-3">

                {cars.map((car) => {
                    return (
                        <section key={car.id} className="w-full bg-white rounded-lg relative">
                            <button
                                className="absolute bg-white w-12 h-12 rounded-full flex justify-center items-center right-2 top-2 cursor-pointer hover:bg-red-100 hover:text-red-500 transition-all drop-shadow"
                                onClick={() => handleDeleteCar(car)}
                            >
                                <FiTrash size={21} />
                            </button>
                            <img
                                src={car.images[0].url}
                                alt=""
                                className="w-full rounded-lg mb-2 max-h-72"
                            />
                            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700 mb-6">{car.year} | {car.km}</span>
                                <strong className="text-black font-medium text-xl">R$ {car.price}</strong>
                            </div>

                            <div className="w-full h-px my-2 bg-slate-300"></div>

                            <div className="px-2 pb-2 ">
                                <span className="text-zinc-600">{car.city}</span>
                            </div>

                        </section>
                    )
                })}

            </main>
        </Container>
    )
}