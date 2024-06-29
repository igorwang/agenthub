import { Toaster } from "sonner";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full w-full flex-col gap-4">
      <Toaster />
      {/* <div className="inline-block max-w-lg text-center justify-center"> */}
      {children}
      {/* </div> */}
    </section>
  );
}
