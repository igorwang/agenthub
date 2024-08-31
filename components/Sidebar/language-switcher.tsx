import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Language {
  key: string;
  name: string;
  icon: string;
}

const languages: Language[] = [
  { key: "zh", name: "中文", icon: "emojione:flag-for-china" },
  { key: "en", name: "English", icon: "emojione:flag-for-united-states" },
  { key: "hk", name: "香港繁體", icon: "emojione:flag-for-hong-kong-sar-china" },
];

export function useLanguageStorage(initialLanguage: Language) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(initialLanguage);
  const router = useRouter();

  useEffect(() => {
    const storedLanguage = getCookie("userLanguage");
    if (storedLanguage) {
      const languageObject = languages.find((lang) => lang.key === storedLanguage);
      if (languageObject) {
        setSelectedLanguage(languageObject);
        // if (router.locale !== languageObject.key) {
        //   router.push(router.pathname, router.asPath, { locale: languageObject.key });
        // }
      }
    }
  }, [router]);

  const changeLanguage = (newLanguage: Language) => {
    setSelectedLanguage(newLanguage);
    setCookie("userLanguage", newLanguage.key, { maxAge: 365 * 24 * 60 * 60 }); // Set cookie for 1 year
    // router.push(router.pathname, router.asPath, { locale: newLanguage.key });
  };

  return { selectedLanguage, changeLanguage };
}

export default function LanguageSwitcher() {
  const { selectedLanguage, changeLanguage } = useLanguageStorage(languages[0]);

  const handleSelectionChange = (languageKey: string) => {
    const newLanguage = languages.find((lang) => lang.key === languageKey);
    if (newLanguage) {
      changeLanguage(newLanguage);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" className="h-10 w-10">
          <Tooltip
            content={selectedLanguage.name}
            placement="right"
            delay={0}
            closeDelay={0}>
            <Icon icon={selectedLanguage.icon} width="24" height="24" />
          </Tooltip>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Language selection"
        variant="flat"
        selectionMode="single"
        selectedKeys={new Set([selectedLanguage.key])}
        onSelectionChange={(keys) =>
          handleSelectionChange(Array.from(keys as Set<string>)[0])
        }>
        {languages.map((lang) => (
          <DropdownItem
            key={lang.key}
            startContent={<Icon icon={lang.icon} width="18" height="18" />}>
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
