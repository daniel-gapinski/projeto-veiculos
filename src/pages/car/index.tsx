import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Swiper, SwiperSlide } from "swiper/react";

import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";

interface CarProps {
    id: string;
    name: string;
    model: string;
    city: string;
    year: string;
    km: string;
    description: string;
    created: string;
    price: string | number;
    owner: string;
    uid: string;
    whatsapp: string;
    images: ImagesCarProps[];
}

interface ImagesCarProps {
    uid: string;
    name: string;
    url: string;
}

export function CarDetail() {
    const { id } = useParams();
    const [car, setCar] = useState<CarProps>();
    const [sliderPerView, setSliderPerView] = useState<number>(2);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCar() {
            if (!id) {
                return;
            }
            const docRef = doc(db, "cars", id)
            getDoc(docRef).then((snapshot) => {
                //console.log(snapshot);
                if (!snapshot.data()) {
                    navigate("/");
                    return;
                }

                setCar({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    city: snapshot.data()?.city,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    description: snapshot.data()?.description,
                    created: snapshot.data()?.created,
                    price: snapshot.data()?.price,
                    owner: snapshot.data()?.owner,
                    uid: snapshot.data()?.uid,
                    whatsapp: snapshot.data()?.whatsapp,
                    images: snapshot.data()?.images,
                });
            });
            //console.log(car)
        }
        loadCar();
    }, [id]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 968) {
                setSliderPerView(1);
            } else {
                setSliderPerView(2);
            }
        }
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    return (
        <Container>

            {car && (
                <Swiper
                    slidesPerView={sliderPerView}
                    pagination={{ clickable: true }}
                    navigation
                >
                    {car?.images.map(image => (
                        <SwiperSlide key={image.name}>
                            <img
                                src={image.url}
                                alt=""
                                className="w-full h-96 object-cover"
                            />
                        </SwiperSlide>
                    ))}

                </Swiper>
            )}

            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4 ">
                    <div className="w-full flex flex-col md:flex-row mb-4 justify-between">
                        <h1 className="font-semibold text-2xl">{car?.name}</h1>
                        <h1 className="font-semibold text-2xl">R$ {car?.price}</h1>
                    </div>
                    <p className="">{car?.model}</p>

                    <div className="flex w-full gap-6 my-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{car?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{car?.year}</strong>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>KM</p>
                                <strong>{car?.km}</strong>
                            </div>

                        </div>
                    </div>

                    <div className="my-7">
                        <strong>Descrição</strong>
                        <p>{car?.description}</p>
                    </div>

                    <div>
                        <strong>Telefone / WhatsApp</strong>
                        <p>{car?.whatsapp}</p>
                        <a
                            className="bg-green-500 my-4 text-white w-full hover:bg-green-700 transition-all flex items-center gap-2 justify-center p-2 rounded-lg"
                            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi o seu ${car?.name} no site WP Veículos e fiquei interessado!`}
                            target="_blank"
                        >
                        Conversar com o vendedor <FaWhatsapp size={21}
                        />
                        </a>
                    </div>
                </main>
            )}
        </Container>
    )
}