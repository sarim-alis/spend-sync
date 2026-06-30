// Imports.
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "@/styles/login/login";
import { useAuth } from "@/context/AuthContext";
import { useLoginMutation } from "@/queries/auth/login";
import Loader from "../../components/Loader"

export default function Login() {
  // States.
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const loginMutation = useLoginMutation();

  // Handle login.
  const handleLogin = async () => {
    setError("");
    loginMutation.mutate({ email, password },
      {
        onSuccess: (data) => {
          setAuth(data.token, String(data.userId), data.name);
          router.push("/home");
        },
        onError: (err) => {
          console.error("Login Error:", err.message);
          setError(err.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image src="/logo.png" alt="Spend Sync Logo" width={80} height={80} className={styles.logo} />
        <h1 className={styles.slogan}>Spend Sync</h1>

        <label className={styles.label}>Email:</label>
        <input type="email" className={styles.dive} value={email} onChange={(e) => setEmail(e.target.value)} autoCapitalize="none" />

        <label className={styles.label}>Password:</label>
        <div className={styles.inputWrapper}>
          <input type={showPassword ? "text" : "password"} className={styles.dive} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}

        <button className={styles.button} onClick={handleLogin} disabled={loginMutation.isPending}>
          <span className={styles.buttonText}>
            {loginMutation.isPending ? (
              <div className="flex items-center justify-center">
                <Loader size={20} />
              </div>
            ) : (
              "LOGIN"
            )}
          </span>
        </button>

        <p className={styles.switchText} onClick={() => router.push("/register")}>
          Don&apos;t have an account? Register
        </p>
      </div>
    </div>
  );
}
