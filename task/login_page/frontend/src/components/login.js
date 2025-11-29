import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    console.log("login button clicked");
    setEmail("");
    setPassword("");
  }
   const handlelogin = async () ={
    try {
        const res = await axios ("http://localhost:3333/post/login",
        {
          email,
          password,
        })


  return (
    <div>

      <h2>Login</h2>

      <input type="email" placeholder="Email Id:" value={email} onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input type="password" placeholder="Password:" value={password} onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
