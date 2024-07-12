import { Spinner } from "@nextui-org/react";

export default function LoadingPage() {
  return (
    <div className="flex w-dvw items-center justify-center">
      <Spinner label="Loading..." />
    </div>
  );
}
