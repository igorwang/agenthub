import ShareLinkCard from "@/components/ui/share-link-card";
import { Icon } from "@iconify/react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface AgentConfigButtonsProps {
  onConfigClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDashboardClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onShareClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isConfigLoading: boolean;
  isDashboardLoading: boolean;
  isShareLoading: boolean;
  shareLink: string;
}

const AgentConfigButtons: React.FC<AgentConfigButtonsProps> = ({
  onConfigClick,
  onDashboardClick,
  onShareClick,
  isConfigLoading,
  isDashboardLoading,
  isShareLoading,
  shareLink,
}) => {
  const t = useTranslations();
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState<boolean>(false);
  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (!isRendered) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <div className="flex gap-1">
      <Popover
        isOpen={isSharePopoverOpen}
        onOpenChange={(open) => setIsSharePopoverOpen(open)}>
        <PopoverTrigger>
          <Tooltip content={t("Share")}>
            <Button
              isIconOnly
              variant="light"
              onClick={onShareClick}
              isLoading={isShareLoading}
              disabled={isShareLoading}>
              {!isShareLoading && <Icon icon="lucide:share" fontSize={24} />}
            </Button>
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          {shareLink && <ShareLinkCard shareLink={shareLink} />}
        </PopoverContent>
      </Popover>
      <Tooltip content={t("Configure Agent")}>
        <Button
          isIconOnly
          variant="light"
          onClick={onConfigClick}
          isLoading={isConfigLoading}
          disabled={isConfigLoading || isDashboardLoading}>
          {!isConfigLoading && <Icon icon="lucide:settings" fontSize={24} />}
        </Button>
      </Tooltip>
      <Tooltip content={t("Agent Dashboard")}>
        <Button
          isIconOnly
          variant="light"
          onClick={onDashboardClick}
          isLoading={isDashboardLoading}
          disabled={isConfigLoading || isDashboardLoading}>
          {!isDashboardLoading && <Icon icon="lucide:layout-dashboard" fontSize={24} />}
        </Button>
      </Tooltip>
    </div>
  );
};

export default AgentConfigButtons;
