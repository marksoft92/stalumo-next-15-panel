'use client';

import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
type FormData = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const { register, handleSubmit } = useForm<FormData>();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        const res = await signIn('credentials', {
            redirect: false,
            username: data.username,
            password: data.password,
        });

        if (res?.ok) {
            router.push('/');
        } else {
            setError('Nieprawidłowy login lub hasło');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full'>
            <Link href="https://stalumo.com">            <Image
                src="/assets/images/stalumo.png"
                width={145}
                height={113}
                alt="Logo Stalumo"
                loading="lazy"
            /></Link>
            <div className="flex items-center justify-center bg-gray-900 w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                    <h1 className="text-2xl font-bold mb-6 text-center">Logowanie</h1>

                    <label className="block mb-2 font-medium text-black">Nazwa użytkownika</label>
                    <input
                        {...register('username')}
                        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                        required
                    />

                    <label className="block mb-2 font-medium text-black">Hasło</label>
                    <input
                        type="password"
                        {...register('password')}
                        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                        required
                    />

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full  text-white py-2 px-4 rounded transition  bg-[#EB4036]  hover:bg-[#EB4036]-700"
                    >
                        Zaloguj się
                    </button>
                </form>
            </div>
        </div>
    );
}
