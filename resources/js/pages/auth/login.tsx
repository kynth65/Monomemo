import { Head, Link, useForm } from '@inertiajs/react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <ReactLenis root>
            <Head title="Log In" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f5] p-6 text-[#2c2c2c]">
                <div className="mx-auto w-full max-w-sm">
                    <div className="text-center">
                        <Link href={route('home')}>
                            <h1 className="text-3xl font-extralight tracking-wider text-[#2c2c2c]">MONOMEMO</h1>
                        </Link>
                        <h2 className="mt-4 text-2xl font-light tracking-wide text-[#2c2c2c]">Log in to your account</h2>
                        <p className="mt-2 text-sm text-[#666]">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="font-medium text-[#d4af37] hover:text-[#2c2c2c]">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="sr-only">
                                    Email address
                                </Label>
                                <div className="mt-2">
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
                            </div>

                            <div>
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <div className="mt-2">
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-md border-gray-300 text-center shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37]"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} className="mt-2 text-center" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onCheckedChange={() => setData('remember', !data.remember)}
                                        className="data-[state=checked]:border-[#d4af37] data-[state=checked]:bg-[#d4af37]"
                                    />
                                    <Label htmlFor="remember" className="ml-2 block text-sm">
                                        Remember me
                                    </Label>
                                </div>

                                {canResetPassword && (
                                    <div className="text-sm">
                                        <Link href={route('password.request')} className="font-medium text-[#d4af37] hover:text-[#2c2c2c]">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="flex w-full justify-center rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-12 py-4 text-base font-medium tracking-wider text-white uppercase transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Log in
                                </Button>
                            </div>
                        </form>

                        {status && <div className="mt-4 mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                    </div>
                </div>
            </div>
        </ReactLenis>
    );
}
