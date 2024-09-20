import { Icon } from "@iconify/react";
import {
  Button,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};
export type LinkEditorPanelProps = {
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const LinkEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialUrl,
}: LinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab || false);

  const onChange = useCallback((value: string) => {
    setUrl(value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url, openInNewTab);
      }
    },
    [url, isValidUrl, openInNewTab, onSetLink],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <Input
        type="url"
        label="URL"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        startContent={<Icon icon="lucide:link" />}
      />
      <Checkbox isSelected={openInNewTab} onValueChange={setOpenInNewTab}>
        Open in new tab
      </Checkbox>
      <Button color="primary" type="submit" disabled={!isValidUrl}>
        Set Link
      </Button>
    </form>
  );
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button isIconOnly variant="light" aria-label="Set Link">
          <Icon icon="lucide:link" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <LinkEditorPanel onSetLink={onSetLink} />
      </PopoverContent>
    </Popover>
  );
};
