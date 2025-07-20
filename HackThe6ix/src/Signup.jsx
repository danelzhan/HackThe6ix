import React, { useState, useEffect } from "react";
import { postUser } from "./Bridge.js";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export function SignupPage(user) {


    console.log(user)
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();


      const [form, setForm] = useState({
    _id: "",
    name: "",
    age: "",
    sex: "",
    doctor: "",
    allergies: "",
    medical_history: "",
  });

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format as your JSON object
    const data = {
      ...form,
      age: Number(form.age),
      allergies: form.allergies
        ? form.allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      medical_history: form.medical_history
        ? form.medical_history.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      nodes: [],
      edges: [],
    };
    postUser(JSON.stringify(data)); // fallback
    navigate("/profile");
  };

    return (
        <div className="app">
        <form onSubmit={handleSubmit}>
        <label>
            Email (_id): <input name="_id" value={form._id} onChange={handleChange} required />
        </label>
        <br />
        <label>
            Name: <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
            Age: <input name="age" type="number" value={form.age} onChange={handleChange} required />
        </label>
        <br />
        <label>
            Sex:
            <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            </select>
        </label>
        <br />
        <label>
            Doctor: <input name="doctor" value={form.doctor} onChange={handleChange} />
        </label>
        <br />
        <label>
            Allergies (comma-separated): <input name="allergies" value={form.allergies} onChange={handleChange} />
        </label>
        <br />
        <label>
            Medical History (comma-separated): <input name="medical_history" value={form.medical_history} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
        </form>

        </div>
    );
}