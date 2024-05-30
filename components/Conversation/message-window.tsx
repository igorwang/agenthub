import React from "react";
import { AppDispatch } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedChatId,
  selectSelectedSessionId,
} from "@/lib/features/chatListSlice";
import { useSession } from "next-auth/react";

import MessageCard from "./message-card";
import { useGetMessageListSubscription } from "@/graphql/generated/types";
import { Avatar } from "@nextui-org/react";
import FeatureCards from "@/components/Conversation/feature-cards";

export const assistantMessages = [
  <div key="1">
    <p className="mb-5">
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      Certainly! Here&apos;s a summary of five creative ways to use your
      kids&apos; art:
    </p>
    {/* <ol className="space-y-2">
      <li>
        <strong>Create Art Books:</strong> Turn scanned artwork into custom
        photo books.
      </li>
      <li>
        <strong>Set Up a Gallery Wall:</strong> Use a dedicated wall with
        interchangeable frames for displaying art.
      </li>
      <li>
        <strong>Make Functional Items:</strong> Print designs on items like
        pillows, bags, or mugs.
      </li>
      <li>
        <strong>Implement an Art Rotation System:</strong> Regularly change the
        displayed art, archiving the older pieces.
      </li>
      <li>
        <strong>Use as Gift Wrap:</strong> Repurpose art as unique wrapping
        paper for presents.
      </li>
    </ol> */}
  </div>,
  <div key="2">
    <p className="mb-3">
      Of course! Here are five more creative suggestions for what to do with
      your children&apos;s art:
    </p>
    <ol className="space-y-2">
      <li>
        <strong>Create a Digital Archive:</strong> Scan or take photos of the
        artwork and save it in a digital cloud storage service for easy access
        and space-saving.
      </li>
      <li>
        <strong>Custom Calendar:</strong> Design a custom calendar with each
        month showcasing a different piece of your child&apos;s art.
      </li>
      <li>
        <strong>Storybook Creation:</strong> Compile the artwork into a
        storybook, possibly with a narrative created by your child, to make a
        personalized book.
      </li>
      <li>
        <strong>Puzzle Making:</strong> Convert their artwork into a jigsaw
        puzzle for a fun and unique pastime activity.
      </li>
      <li>
        <strong>Home Decor Items:</strong> Use the artwork to create home decor
        items like coasters, magnets, or lampshades to decorate your house.
      </li>
    </ol>
  </div>,
];

export const userMessages = [
  "What are 5 creative things I could do with my kids' art? I don't want to throw them away, but it's also so much clutter.",
  "I didn't like the suggestions. Can you give me some more?",
];

export default function MessageWindow() {
  const dispatch: AppDispatch = useDispatch();

  const selectedChatId = useSelector(selectSelectedChatId);
  const selectedSessionId = useSelector(selectSelectedSessionId);

  const session = useSession();
  const user_id = session.data?.user?.id;
  const agent_id = selectedChatId;

  const { data, loading, error } = useGetMessageListSubscription({
    variables: {
      session_id: selectedSessionId || "", // Provide a default value
      limit: 10,
    },
    skip: !selectedSessionId, // Skip the query if session_id is not provided
  });

  const messages = [
    {
      role: "user",
      message: userMessages[0],
    },
    {
      role: "assistant",
      message: assistantMessages[0],
    },
    {
      role: "assistant",
      message: assistantMessages[0],
    },
    {
      role: "assistant",
      message: assistantMessages[0],
    },
  ];

  const featureContent = (
    <div className="flex h-full flex-col justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <Avatar
          size="lg"
          src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
        />
        <h1 className="text-xl font-medium text-default-700">
          How can I help you today?
        </h1>
        <FeatureCards />
      </div>
    </div>
  );
  return (
    <div className="flex flex-1 flex-grow flex-col px-1 gap-1 ">
      {messages.length === 0 && featureContent}

      {messages.map(({ role, message }, index) => (
        <MessageCard
          key={index}
          attempts={index === 1 ? 2 : 1}
          avatar={
            role === "assistant"
              ? "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
              : "https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png"
          }
          currentAttempt={index === 1 ? 2 : 1}
          message={message}
          isUser={role === "user"}
          messageClassName={
            role === "user" ? "bg-content3 text-content3-foreground" : ""
          }
          showFeedback={role === "assistant"}
        />
      ))}
    </div>
  );
}
