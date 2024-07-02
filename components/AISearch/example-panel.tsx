import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/button";

const exampleMessages = [
  {
    heading: "Introduction to Hong Kong Securities Law",
    message: "What is Hong Kong securities law?",
  },
  {
    heading: "Recent Developments in Hong Kong Anti-Money Laundering Regulations",
    message:
      "Why are Hong Kong's anti-money laundering regulations receiving attention recently?",
  },
  {
    heading: "Functions of the Hong Kong Monetary Authority",
    message: "What are the functions of the Hong Kong Monetary Authority?",
  },
  {
    heading: "Hong Kong Financial Regulations vs International Standards",
    message:
      "How do Hong Kong's financial regulations compare to international standards?",
  },
];

interface ExamplePanelProps {
  className?: string;
  submitMessage: (message: string) => void;
}
const ExamplePanel: React.FC<ExamplePanelProps> = ({ className, submitMessage }) => {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mb-4 mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="light"
              className="h-auto p-0 text-base data-[hover]:bg-transparent data-[hover]:underline"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message);
              }}>
              <Icon icon={"material-symbols-light:line-end-arrow"}></Icon>
              <span className="text-slate-400">{message.heading}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplePanel;
