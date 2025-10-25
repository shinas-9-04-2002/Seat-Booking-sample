import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        value={form.email}
        onChange={(e)=>setForm({...form,email:e.target.value})}
        placeholder="Email"
        className="block w-full mb-3 p-2 border rounded"
      />
      <input
        value={form.password}
        onChange={(e)=>setForm({...form,password:e.target.value})}
        placeholder="Password"
        type="password"
        className="block w-full mb-4 p-2 border rounded"
      />
      <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">Login</button>
    </form>
  );
}
