import backgroundImage from "@/assets/wizard-bg-4.jpg";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signUp(email, password);
    if (res.error) setError(res.error);
    else navigate("/generate");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-background flex flex-col gap-4 p-6 md:p-10 relative">
        {/* Purple Radial Glow Background */}
        {/* <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle 700px at 50% 500px, rgba(139, 92, 246, 0.34), transparent)`,
          }}
        /> */}

        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="w-[400px] mx-auto flex flex-1 items-center justify-center relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Create your account
              </h1>
              <p className="text-md text-slate-300">
                Sign up to start generating images with MageMind.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base bg-background border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
              <Input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base bg-background border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
              />
              {error && <div className="text-base text-red-400">{error}</div>}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold text-black"
                style={{
                  background:
                    "linear-gradient(135deg, #E0B0FF 0%, #ADD8E6 50%, #FFC0CB 100%)",
                  border: "none",
                }}
              >
                Create account
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-base text-slate-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-300 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="relative mt-6 mb-12">
              <div className="absolute inset-0 flex items-center">
                <div className="flex-1 border-t border-slate-600"></div>
                <div className="px-4">
                  <span className="text-xs uppercase text-slate-500">Or</span>
                </div>
                <div className="flex-1 border-t border-slate-600"></div>
              </div>
            </div>

            <Button
              onClick={signInWithGoogle}
              className="w-full h-12 text-base font-semibold mt-4 bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-2"
            >
              <FcGoogle />
              Sign up with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={backgroundImage}
          alt="Dreamy Studio"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
