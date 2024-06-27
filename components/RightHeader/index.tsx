import react from "react";

import { Tabs, Tab } from "@nextui-org/react";
import { IcBaselineArrowBackIosNew } from "../ui/icons";
import { useRouter } from "next/navigation";

interface RightHeaderProps {
  title?: string;
  callBackUri?: string;
}

export default function RightHeader(props: RightHeaderProps) {
  const router = useRouter();
  const { title, callBackUri } = props;

  return (
    //component needs to be used  with the styling of its parent node
    <div
      className="flex w-full flex-wrap  justify-center items-center gap-2 border-b-small border-divider pb-2 sm:justify-between">
      <div className={"flex items-center"}>
        <IcBaselineArrowBackIosNew
          className={"cursor-pointer ml-2"}
          onClick={() => callBackUri ? router.push(callBackUri) : router.back()}
        />
        <p className="text-base font-medium">{title}</p>
      </div>

      <Tabs className="justify-center">
        <Tab key="simple" title="Simple" />
        <Tab key="deep" title="Deep" />
        <Tab key="creative" title="Creative" />
      </Tabs>
    </div>
  );
};
