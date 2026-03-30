import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [login, { data, loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ variables: form });
    const token = result?.data?.login?.token;
    if (token) {
      localStorage.setItem("token", token);
      alert("Login successful");
      setForm({ email: "", password: "" }); 
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">{loading ? "Loading..." : "Login"}</button>
      </form>
      {error && <p>{error.message}</p>}
      {data && <p>{data.login.message}</p>}
    </div>
  );
}