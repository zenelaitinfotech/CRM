import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithBackend } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // Map backend response correctly
      loginWithBackend({
        user: { 
          name: data.user.name, 
          email: data.user.email, 
          role: data.user.role 
        },
        token: data.token,
        profile: { name: data.user.name, email: data.user.email },
      });

      // Redirect based on role
      if (data.user.role === "admin") navigate("/admin");
      else navigate("/");

    } catch (err: any) {
      console.log("Backend error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-center mt-4">
  Don’t have an account?{" "}
  <span
    className="text-primary cursor-pointer hover:underline"
    onClick={() => navigate("/signup")}
  >
    Create account
  </span>
</p>
      </div>
    </div>
  );
};

export default Login;