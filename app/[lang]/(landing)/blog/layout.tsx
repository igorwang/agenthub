import { Toaster } from "sonner";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col w-full h-full gap-4 ">
      <Toaster />
      {/* <div className="inline-block max-w-lg text-center justify-center"> */}
      {children}
      {/* </div> */}
    </section>
  );
}
