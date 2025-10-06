
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signUp(email, password);
    if (res.error) setError(res.error);
    else navigate('/dashboard');
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <Card className="w-full border border-border">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Sign up to start generating images with Dreamy.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-3">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit">Create account</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm">
            Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Signup;
