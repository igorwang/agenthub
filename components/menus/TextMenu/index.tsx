import FontSizePicker from "@/components/menus/TextMenu/compnents/font-size-picker";
import { useTextMenuCommand } from "@/components/menus/TextMenu/hooks/useTextMenuCommand";
import { useTextmenuStates } from "@/components/menus/TextMenu/hooks/useTextmenuStates";
import { Icon } from "@iconify/react";
import { Button, ButtonGroup, Divider, Tooltip } from "@nextui-org/react";
import { Editor } from "@tiptap/react";
import { useTranslations } from "next-intl";
import { memo } from "react";

const MemoFontSizePicker = memo(FontSizePicker);

export type TextMenuProps = {
  editor: Editor;
};
const TextMenu = ({ editor }: TextMenuProps) => {
  const t = useTranslations("");
  const commands = useTextMenuCommand(editor);
  const states = useTextmenuStates(editor);

  return (
    <ButtonGroup className="flex flex-row rounded-none bg-white">
      <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize} />
      <Tooltip content={t("alignLeft")}>
        <Button isIconOnly onClick={commands.onAlignLeft} className={"w-8 min-w-8"}>
          <Icon icon="lucide:align-left" />
        </Button>
      </Tooltip>
      <Tooltip content={t("alignCenter")}>
        <Button isIconOnly onClick={commands.onAlignCenter} className={"w-8 min-w-8"}>
          <Icon icon="lucide:align-center" />
        </Button>
      </Tooltip>
      <Tooltip content={t("alignRight")}>
        <Button isIconOnly onClick={commands.onAlignRight} className={"w-8 min-w-8"}>
          <Icon icon="lucide:align-right" />
        </Button>
      </Tooltip>
      <Tooltip content={t("alignJustify")}>
        <Button isIconOnly onClick={commands.onAlignJustify} className={"w-8 min-w-8"}>
          <Icon icon="lucide:align-justify" />
        </Button>
      </Tooltip>
      <Divider orientation="vertical" />
      <Tooltip content={t("bold")}>
        <Button isIconOnly onClick={commands.onBold} className={"w-8 min-w-8"}>
          <Icon icon="lucide:bold" />
        </Button>
      </Tooltip>
      <Tooltip content={t("italic")}>
        <Button isIconOnly onClick={commands.onItalic} className={"w-8 min-w-8"}>
          <Icon icon="lucide:italic" />
        </Button>
      </Tooltip>
      <Tooltip content={t("underline")}>
        <Button isIconOnly onClick={commands.onUnderline} className={"w-8 min-w-8"}>
          <Icon icon="lucide:underline" />
        </Button>
      </Tooltip>
      <Tooltip content={t("strike")}>
        <Button isIconOnly onClick={commands.onStrike} className={"w-8 min-w-8"}>
          <Icon icon="lucide:strikethrough" />
        </Button>
      </Tooltip>
      <Tooltip content={t("code")}>
        <Button isIconOnly onClick={commands.onCode} className={"w-8 min-w-8"}>
          <Icon icon="lucide:code" />
        </Button>
      </Tooltip>
      <Tooltip content={t("codeBlock")}>
        <Button isIconOnly onClick={commands.onCodeBlock} className={"w-8 min-w-8"}>
          <Icon icon="lucide:file-code" />
        </Button>
      </Tooltip>
      <Tooltip content={t("highlight")}>
        <Button
          isIconOnly
          onClick={() => {
            commands.onToggleHighlight("#ffc078");
          }}
          className={"w-8 min-w-8"}>
          <Icon icon="lucide:highlighter" />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export default TextMenu;
