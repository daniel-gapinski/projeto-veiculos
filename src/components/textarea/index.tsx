import { RegisterOptions, UseFormRegister } from "react-hook-form";


interface TextareaProps{
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function TextArea({ name, placeholder, register, error, rules } : TextareaProps) {
    return(
        <div>
            <textarea 
                className="w-full border-1 rounded-md px-3 py-1 outline-0 border-zinc-300 resize-vertical min-h-32" 
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