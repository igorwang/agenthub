import SmartEditor from "@/components/SmartEditor";
import { useTranslations } from "next-intl";

export default function EditorPage() {
  const t = useTranslations("");

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      <SmartEditor />
    </div>
  );
}
