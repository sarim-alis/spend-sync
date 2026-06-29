"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import styles from "@/styles/register/register";
import { useAuth } from "@/context/AuthContext";
import { useRegisterMutation, useAutoLoginMutation } from "@/queries/auth/register";

export default function Register() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = useRegisterMutation();
  const autoLoginMutation = useAutoLoginMutation();

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          autoLoginMutation.mutate(
            { email, password },
            {
              onSuccess: (loginData) => {
                setAuth(loginData.token, String(loginData.userId), loginData.name);
                router.push("/home");
              },
              onError: () => {
                router.push("/login");
              },
            }
          );
        },
        onError: (err) => {
          console.error("Register Error:", err.message);
          setError(err.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image
          src="/logo.png"
          alt="Spend Sync Logo"
          width={80}
          height={80}
          className={styles.logo}
        />
        <h1 className={styles.slogan}>Spend Sync</h1>

        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={styles.dive}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoCapitalize="words"
        />

        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.dive}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
        />

        <label className={styles.label}>Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.dive}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eyeIcon}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button
          className={styles.button}
          onClick={handleRegister}
          disabled={registerMutation.isPending || autoLoginMutation.isPending}
        >
          <span className={styles.buttonText}>
            {registerMutation.isPending || autoLoginMutation.isPending ? "LOADING..." : "REGISTER"}
          </span>
        </button>

        <p
          className={styles.switchText}
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
