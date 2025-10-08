
import vibrantCityBg from '@/assets/vibrant-city-bg.jpg';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn(email, password);
    if (res.error) setError(res.error);
    else navigate('/generate');
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-black flex flex-col gap-4 p-6 md:p-10 relative">
        {/* Purple Radial Glow Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 700px at 50% 500px, rgba(139, 92, 246, 0.34), transparent)`,
          }}
        />
        
        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center relative z-10">
          <div className="w-full max-w-xs">
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
                <CardTitle className="text-white text-center">Sign in to Dreamy</CardTitle>
                <CardDescription className="text-slate-300 text-center">Enter your email and password to continue.</CardDescription>
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
                      placeholder="••••••••" 
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
                    Sign in
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-slate-300 text-center">
                  New here? <Link to="/signup" className="text-purple-300 hover:underline">Create an account</Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={vibrantCityBg}
          alt="Dreamy Studio"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
