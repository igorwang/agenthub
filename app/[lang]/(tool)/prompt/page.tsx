import PromptForm from "@/components/PromptFrom";

interface PromptPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export default function PromptPage(searchParams: PromptPageProps) {
  return (
    <div>
      <PromptForm />
    </div>
  );
}
