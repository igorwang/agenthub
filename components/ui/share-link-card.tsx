"use client";

import { Icon } from "@iconify/react";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ShareLinkCardProps {
  shareLink: string;
}

const ShareLinkCard = ({ shareLink }: ShareLinkCardProps) => {
  const t = useTranslations("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-sm p-4">
      <h3 className="mb-2 text-lg font-semibold">{t("Share Link")}</h3>
      <Input
        value={shareLink}
        readOnly
        className="mb-3"
        endContent={
          <Tooltip content={copied ? t("copied") : t("copy_link")}>
            <Button isIconOnly variant="light" onPress={copyToClipboard}>
              <Icon icon="mdi:content-copy" width="20" height="20" />
            </Button>
          </Tooltip>
        }
      />
      <Button
        as="a"
        href={shareLink}
        target="_blank"
        rel="noopener noreferrer"
        startContent={<Icon icon="mdi:open-in-new" width="20" height="20" />}
        fullWidth
        color="primary">
        {t("open_link")}
      </Button>
    </div>
  );
};

export default ShareLinkCard;
