import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f5] p-6 text-[#2c2c2c]">
                <div className="mx-auto w-full max-w-sm">
                    <div className="text-center">
                        <Link href={route('home')}>
                            <h1 className="text-3xl font-extralight tracking-wider text-[#2c2c2c]">MONOMEMO</h1>
                        </Link>
                        <h2 className="mt-4 text-2xl font-light tracking-wide text-[#2c2c2c]">Forgot your password?</h2>
                        <p className="mt-2 text-sm text-[#666]">
                            No problem. Just let us know your email address and we will email you a password reset link.
                        </p>
                    </div>

                    <div className="mt-8">
                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="sr-only">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-md border-gray-300 text-center shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37]"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} className="mt-2 text-center" />
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="flex w-full justify-center rounded-none border-2 border-[#2c2c2c] bg-[#2c2c2c] px-12 py-4 text-base font-medium uppercase tracking-wider text-white transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Email Password Reset Link
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-[#666]">
                            Remember your password?{' '}
                            <Link
                                href={route('login')}
                                className="font-medium text-[#d4af37] hover:text-[#2c2c2c]"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
