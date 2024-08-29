import CustomForm from "@/components/ui/nextui-form";
import { useCallback } from "react";
import { useTranslations } from "use-intl";

interface NodeData {
  [key: string]: any;
}

interface HumanInLoopFormProps {
  schema: { [key: string]: any };
  uiSchema?: { [key: string]: any };
  formData?: { [key: string]: any };
  onSubmit?: (data: { [key: string]: any }) => void;
  onClose?: () => void;
  disabled?: boolean;
}

export default function HumanInLoopForm({
  schema,
  uiSchema = {},
  disabled = false,
  formData = {},
  onSubmit,
  onClose,
}: HumanInLoopFormProps) {
  const t = useTranslations();

  const handleSumbit = useCallback((data: any) => {
    onSubmit?.(data);
  }, []);

  const handleClose = useCallback(() => {
    onClose?.();
  }, []);
  return (
    <div className="flex w-full flex-col gap-4 px-2">
      {!disabled && (
        <div className="text-medium font-bold">
          {schema.ttle || t("Please fill out the information in the form below")}
        </div>
      )}
      <CustomForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={handleSumbit}
        onClose={handleClose}
        disabled={disabled}
      />
    </div>
  );
}
