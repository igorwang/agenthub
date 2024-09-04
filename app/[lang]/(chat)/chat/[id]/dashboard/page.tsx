import SessionTable from "@/components/SessionTable";
import {
  BlueStatisticCard,
  GreenStatisticCard,
  PurpleStatisticCard,
  WhiteStatisticCard,
} from "@/components/ui/statistic-card";
import { getTranslations } from "next-intl/server";

const cardData = {
  title: "Agent Uers",
  subtitle: "users",
  total: "1358",
  amount: "15,72",
  percentage: "+ 6.2%",
  stats: [
    { icon: "↓", value: "87,425 USD" },
    { icon: "↑", value: "62,890 USD" },
    { icon: "⭐", value: "143 VIP" },
  ],
};

const sessionData = {
  title: "Sessions",
  subtitle: "sessions",
  total: "2467",
  amount: "8,95",
  percentage: "- 2.1%",
  stats: [
    { icon: "↓", value: "95,630 USD" },
    { icon: "↑", value: "48,750 USD" },
    { icon: "⭐", value: "98 VIP" },
  ],
};

const fileData = {
  title: "Storages",
  subtitle: "files",
  total: "3782",
  amount: "12,36",
  percentage: "+ 3.8%",
  stats: [
    { icon: "↓", value: "112,740 USD" },
    { icon: "↑", value: "59,380 USD" },
    { icon: "⭐", value: "167 VIP" },
  ],
};

const TokenConsumeData = {
  title: "Token Usage",
  subtitle: "tokens",
  total: "5214",
  amount: "18,47",
  percentage: "+ 7.5%",
  stats: [
    { icon: "↓", value: "128,560 USD" },
    { icon: "↑", value: "71,920 USD" },
    { icon: "⭐", value: "189 VIP" },
  ],
};
export default async function ChatDashboard({ params }: { params: { id: string } }) {
  const t = await getTranslations();

  return (
    <div className="custom-scrollbar mx-auto flex h-full w-full justify-center overflow-auto p-10">
      <div className="max-w-7xl flex-1 flex-col p-2">
        <div className="mb-2">
          <h1 className="text-2xl font-extrabold tracking-wide">{t("Statistics")}</h1>
          <div className="flex flex-row flex-wrap gap-2">
            <BlueStatisticCard {...cardData} icon="lucide:users-round" />
            <WhiteStatisticCard {...sessionData} icon="lucide:message-square-text" />
            <GreenStatisticCard {...fileData} icon="tdesign:system-storage" />
            <PurpleStatisticCard {...TokenConsumeData} icon="icon-park-outline:consume" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-wide">{t("Sessions")}</h1>
          <SessionTable agentId={params.id} />
        </div>
      </div>
      {/* <div className="min-w-96 bg-slate-400 p-2">right</div> */}
    </div>
  );
}
