import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      message
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "resident",
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup({ variables: form });
    const token = result?.data?.signup?.token;
    if (token) {
      localStorage.setItem("token", token);
      alert("Signup successful");
      setForm({ username: "", email: "", password: "", role: "resident" });
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="resident">Resident</option>
          <option value="business_owner">Business Owner</option>
          <option value="community_organizer">Community Organizer</option>
        </select>
        <button type="submit">{loading ? "Loading..." : "Sign Up"}</button>
      </form>
      {error && <p>{error.message}</p>}
      {data && <p>{data.signup.message}</p>}
    </div>
  );
}