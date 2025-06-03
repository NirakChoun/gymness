import React from "react";
import { RegisterForm } from "../components/RegisterForm";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const registerUser = async (newUser) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registeration failed");
      }

      return data;
    } catch (error) {
      console.error("Registeration error: ", error);
      toast.error(error.message || "Registeration failed");
      throw error;
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm registerUserSubmit={registerUser} />
      </div>
    </div>
  );
};

export default RegisterPage;
