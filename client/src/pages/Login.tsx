import backgroundImage from "@/assets/wizard-bg-6.jpg";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { LoaderCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/imagine", { replace: true });
    }
  }, [loading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);
    if (res.error) setError(res.error);
    else navigate("/imagine");
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-background flex flex-col gap-4 p-6 md:p-10 relative">
        {/* Purple Radial Glow Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_300px_at_50%_400px,hsl(var(--primary)/0.34),transparent)]" />
        <div className="flex justify-center gap-2 md:justify-start relative z-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="w-[400px] mx-auto flex flex-1 items-center justify-center relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl leading-normal font-bold text-white mb-2">
                Harness the Power <br /> of AI Sorcery.
              </h1>
              <p className="text-md text-slate-300">
                Log in to create the extraordinary.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-2">
              <Input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base bg-background text-white"
              />
              <Input
                type="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base bg-background text-white"
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
                 disabled={submitting}
               >
                 {submitting ? (
                   <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                 ) : (
                   "Sign in"
                 )}
               </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-base text-slate-300">
                New here?{" "}
                <Link
                  to="/signup"
                  className="text-purple-300 hover:underline font-medium"
                >
                  Create an account
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
              className="w-full h-12 text-base font-semibold mt-4 bg-background hover:bg-background/10 text-white border border-input flex items-center justify-center gap-2"
            >
              <FcGoogle />
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={backgroundImage}
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
