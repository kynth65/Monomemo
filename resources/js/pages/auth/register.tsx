import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f5] p-6 text-[#2c2c2c]">
                <div className="mx-auto w-full max-w-sm">
                    <div className="text-center">
                        <Link href={route('home')}>
                            <h1 className="text-3xl font-extralight tracking-wider text-[#2c2c2c]">MONOMEMO</h1>
                        </Link>
                        <h2 className="mt-4 text-2xl font-light tracking-wide text-[#2c2c2c]">Create an account</h2>
                        <p className="mt-2 text-sm text-[#666]">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-medium text-[#d4af37] hover:text-[#2c2c2c]"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="sr-only">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    autoFocus
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 text-center shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37]"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2 text-center" />
                            </div>

                            <div>
                                <Label htmlFor="email" className="sr-only">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-md border-gray-300 text-center shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37]"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} className="mt-2 text-center" />
                            </div>

                            <div>
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-md border-gray-300 text-center shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37]"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} className="mt-2 text-center" />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="sr-only">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-md border-gray-300 text-center shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37]"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-center" />
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="flex w-full justify-center rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-12 py-4 text-base font-medium uppercase tracking-wider text-white transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create account
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

