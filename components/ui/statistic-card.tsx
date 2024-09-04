"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import React from "react";

interface StatisticCardProps {
  title: string;
  subtitle: string;
  total: string;
  amount: string;
  percentage: string;
  stats: Array<{
    icon: string;
    value: string;
  }>;
  icon: string;
}

const BaseStatisticCard: React.FC<
  StatisticCardProps & {
    backgroundColor: string;
    textColor: string;
    iconColor: string;
    amountColor: string;
    percentageColorPositive: string;
    percentageColorNegative: string;
  }
> = ({
  title,
  subtitle,
  total,
  amount,
  percentage,
  stats,
  icon,
  backgroundColor,
  textColor,
  iconColor,
  amountColor,
  percentageColorPositive,
  percentageColorNegative,
}) => {
  const isPositive = !percentage.startsWith("-");
  const t = useTranslations();

  return (
    <div className={`w-full max-w-[260px] ${backgroundColor} rounded-xl px-4 shadow-md`}>
      <div className="py-4">
        <div className="flex items-center gap-3">
          <Icon icon={icon} color={iconColor} fontSize={20} />
          <div className="flex flex-col">
            <span className={`${textColor} text-sm font-semibold`}>{t(title)}</span>
            <span className={`text-xs ${textColor} opacity-80`}>
              {total} {t(subtitle)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className={`text-xl font-bold ${amountColor}`}>{amount}</span>
          <span
            className={`text-xs font-medium ${isPositive ? percentageColorPositive : percentageColorNegative}`}>
            {percentage}
          </span>
        </div>
        {/* <div className="flex items-center justify-between">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span
                className={`text-xs font-semibold ${
                  stat.icon === "↓"
                    ? percentageColorNegative
                    : stat.icon === "↑"
                      ? percentageColorPositive
                      : "text-yellow-400"
                }`}>
                {stat.icon}
              </span>
              <span className={`text-xs ${textColor} opacity-80`}>{stat.value}</span>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export const BlueStatisticCard: React.FC<StatisticCardProps> = (props) => (
  <BaseStatisticCard
    {...props}
    backgroundColor="bg-blue-500"
    textColor="text-white"
    iconColor="white"
    amountColor="text-white"
    percentageColorPositive="text-green-300"
    percentageColorNegative="text-red-300"
  />
);

export const WhiteStatisticCard: React.FC<StatisticCardProps> = (props) => (
  <BaseStatisticCard
    {...props}
    backgroundColor="bg-white"
    textColor="text-gray-800"
    iconColor="#697177"
    amountColor="text-gray-900"
    percentageColorPositive="text-green-600"
    percentageColorNegative="text-red-600"
  />
);

export const GreenStatisticCard: React.FC<StatisticCardProps> = (props) => (
  <BaseStatisticCard
    {...props}
    backgroundColor="bg-green-400"
    textColor="text-white"
    iconColor="white"
    amountColor="text-white"
    percentageColorPositive="text-red-500"
    percentageColorNegative="text-red-500"
  />
);

export const PurpleStatisticCard: React.FC<StatisticCardProps> = (props) => (
  <BaseStatisticCard
    {...props}
    backgroundColor="bg-purple-600"
    textColor="text-white"
    iconColor="white"
    amountColor="text-white"
    percentageColorPositive="text-green-300"
    percentageColorNegative="text-pink-300"
  />
);
