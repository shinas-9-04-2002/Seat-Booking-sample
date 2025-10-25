import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        value={form.name}
        onChange={(e)=>setForm({...form,name:e.target.value})}
        placeholder="Name"
        className="block w-full mb-3 p-2 border rounded"
      />
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
      <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</button>
    </form>
  );
}
