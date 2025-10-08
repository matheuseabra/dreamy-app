
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
    else navigate('/generate');
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex items-center justify-center px-4 relative">
      {/* Purple Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 700px at 50% 500px, rgba(139, 92, 246, 0.34), transparent)`,
        }}
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <Card 
          className="w-full backdrop-blur-sm"
          style={{
            border: "1px solid transparent",
            backgroundImage: `
              linear-gradient(to bottom, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)),
              linear-gradient(135deg, rgb(168 85 247 / 0.4), rgb(59 130 246 / 0.4), rgb(147 197 253 / 0.4))
            `,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
        <CardHeader>
          <CardTitle className="text-white text-center">Create your account</CardTitle>
          <CardDescription className="text-slate-300 text-center">Sign up to start generating images with Dreamy.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4">
            <div>
              <label className="block text-sm mb-2 text-slate-300">Email</label>
              <Input 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-300">Password</label>
              <Input 
                type="password" 
                placeholder="Create a strong password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}
            <Button 
              type="submit" 
              className="text-black font-semibold"
              style={{
                background: "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                border: "none",
              }}
            >
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-slate-300 text-center">
            Already have an account? <Link to="/login" className="text-purple-300 hover:underline">Sign in</Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Signup;
