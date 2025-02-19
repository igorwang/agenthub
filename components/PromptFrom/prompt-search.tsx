"use client";
import { SearchIcon } from "@/components/icons";
import { Order_By, useGetPromptListSubscription } from "@/graphql/generated/types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Prompt {
  id: number;
  name: string;
}

const PromptSearchBar: React.FC<{
  defaultPrompt?: Prompt;
  handleChangePrompt?: (id: number | null) => void;
}> = ({ handleChangePrompt, defaultPrompt }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const [value, setValue] = React.useState<string | null>();
  const [selectedKey, setSelectedKey] = React.useState<string | null>();

  const session = useSession();
  const userId = session.data?.user?.id;

  const { data, loading, error } = useGetPromptListSubscription({
    variables: {
      where: {
        creator_id: { _eq: userId },
        ...(value && { name: { _like: `%${value}%` } }),
      },
      order_by: { created_at: Order_By.DescNullsLast },
      limit: 10,
    },
    skip: !userId || !value,
  });

  useEffect(() => {
    if (data && data.prompt_hub) {
      const promptList = data.prompt_hub.map((item) => ({
        id: item.id,
        name: item.name || "",
      }));
      setPrompts(promptList);
    }
  }, [data]);

  const onSelectionChange = (id: string) => {
    setSelectedKey(id);
    setValue("");
    handleChangePrompt?.(Number(id));
  };

  const onInputChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <Autocomplete
        className="max-w-xs"
        aria-label="Search Prompt"
        // inputValue={value}
        items={prompts}
        allowsCustomValue={true}
        selectedKey={selectedKey}
        onSelectionChange={(id) => onSelectionChange(id?.toString() || "")}
        onInputChange={onInputChange}
        // disableSelectorIconRotation={true}
        // onKeyUp={() => setSelection && setSelection(null)}
        selectorIcon={<SearchIcon />}>
        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
      </Autocomplete>
    </div>
  );
};

PromptSearchBar.displayName = "PromptSearchBar";
export default PromptSearchBar;
