"use client";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function Login() {
  const [isVisible, setIsVisible] = React.useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const session = useSession();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectUri = searchParams.get("redirectUri");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
    } catch (error) {
      console.error("Login attempt failed", error);
    }
  };

  useEffect(() => {
    if (session && redirectUri) {
      router.push(`${redirectUri}`);
    }
  }, [session, redirectUri]);

  // useEffect(() => {
  //   // 页面加载时自动点击按钮
  //   // 自动选择Authentik
  //   if (!session) {
  //     if (buttonRef.current) {
  //       buttonRef.current.click();
  //     }
  //   }
  // }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {/* <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button color="primary" type="submit">
            Log In
          </Button>
        </form> */}
        {/* <div className="flex items-center gap-4">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div> */}
        <div className="flex flex-col gap-2">
          <Button
            ref={buttonRef}
            onClick={() => signIn("authentik", { callbackUrl: "/chat" })}
            startContent={
              <Icon
                className="text-default-500"
                icon="simple-icons:anthropic"
                width={24}
              />
            }
            variant="bordered">
            Continue with Authentik
          </Button>
          {/* <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered">
            Continue with Google
          </Button>
          <Button
            startContent={
              <Icon className="text-default-500" icon="fe:github" width={24} />
            }
            variant="bordered">
            Continue with Github
          </Button> */}
        </div>
        {/* <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="#" size="sm">
            Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
}
