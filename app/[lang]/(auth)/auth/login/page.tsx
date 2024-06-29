import Login from "@/components/Login";
import { AcmeIcon } from "@/components/ui/social";

export default function LoginPage() {
  return (
    <div className="min-w-96">
      <div className="flex flex-col items-center pb-6">
        <AcmeIcon size={60} />
        <p className="text-xl font-medium">Welcome Back</p>
        <p className="mb-10 text-small text-default-500">
          Log in to your account to continue
        </p>
        <Login></Login>
      </div>
    </div>
  );
}
