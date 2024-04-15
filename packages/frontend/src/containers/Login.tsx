import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
// import Stack from "react-bootstrap/Stack";
// import Button from "react-bootstrap/Button";
import "./Login.css";
import { Auth } from "aws-amplify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await Auth.signIn(email, password);
      alert("Logged in!");
    } catch (error) {
      // Prints the full error
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="Login">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            autoFocus
            className="form-control form-control-lg"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            className="form-control form-control-lg"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-lg btn-primary" type="submit" disabled={!validateForm()}>
          Login
        </button>
      </form>
    </div>
  );
}