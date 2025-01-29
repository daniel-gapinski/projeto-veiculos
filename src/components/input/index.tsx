import { RegisterOptions, UseFormRegister } from "react-hook-form";


interface InputProps{
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({ name, placeholder, type, register, error, rules } : InputProps) {
    return(
        <div>
            <input 
                className="w-full border-1 rounded-md h-9 px-3 outline-0 border-zinc-300" 
                type={type} 
                placeholder={placeholder} 
                {...register(name, rules)}
                id={name}
            />
            {error && (
                <small className="text-red-500">{error}</small>
            )}
        </div>
    )
}