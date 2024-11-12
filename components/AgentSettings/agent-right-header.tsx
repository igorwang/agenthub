import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IcBaselineArrowBackIosNew } from "../ui/icons";

interface AgentRightHeaderProps {
  title?: string;
  callBackUri?: string;
}

export default function AgentRightHeader(props: AgentRightHeaderProps) {
  const router = useRouter();
  const { title, callBackUri } = props;

  const handleClick = () => {
    const api_url = `${process.env.PLATFORM_API_URL}/docs`;
    window.open(api_url, "_blank");
  };

  return (
    //component needs to be used  with the styling of its parent node
    <div className="flex w-full flex-wrap items-center justify-center gap-2 border-b-small border-divider p-2 sm:justify-between">
      <div className={"flex flex-row items-center"}>
        <IcBaselineArrowBackIosNew
          className={"ml-2 cursor-pointer"}
          onClick={() => (callBackUri ? router.push(callBackUri) : router.back())}
        />
        <p className="text-base font-medium">{title}</p>
      </div>
      <Button
        isIconOnly
        onClick={handleClick}
        className="mr-4"
        variant="light"
        size="sm"
        color="primary">
        <Icon icon="mdi:api" className="text-lg" />
      </Button>

      {/*<Tabs className="justify-center">*/}
      {/*  <Tab key="simple" title="Simple" />*/}
      {/*  <Tab key="deep" title="Deep" />*/}
      {/*  <Tab key="creative" title="Creative" />*/}
      {/*</Tabs>*/}
    </div>
  );
}
