"use client";
import { Button, Card, Input } from "@nextui-org/react";
import React, { ChangeEvent, FormEvent, useState } from "react";

const ComingSoonPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <Card className="w-full max-w-md p-5">
        <h1 className="mb-4 text-center text-4xl font-bold">Coming Soon</h1>
        <h2 className="mb-4 text-center text-2xl">
          We are working hard to bring you something amazing.
        </h2>
        <p className="mb-8 text-center">
          Be the first to know when we launch. Subscribe to our newsletter for updates.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            fullWidth
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            aria-label="Email input"
          />
          <Button type="submit" className="w-full">
            Notify Me
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
