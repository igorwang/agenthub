import { LibraryIcon } from "@/components/ui/icons";
import { Knowledge_Base_Type_Enum } from "@/graphql/generated/types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
} from "@nextui-org/react";

export type LibraryCardProps = {
  id: string;
  base_type: Knowledge_Base_Type_Enum;
  name?: string;
  from?: string;
  avatar?: string;
  description?: string;
  creator?: string;
};

const LibraryCard: React.FC<{ library: LibraryCardProps }> = ({ library }) => {
  return (
    <Card key={library.id} className="mx-4 my-4 w-[280px]">
      <CardHeader className="flex gap-3 overflow-auto">
        <div className="min-h-10 min-w-10 flex-shrink-0">
          {library.avatar ? (
            <Image
              alt="library logo"
              height={40}
              radius="sm"
              src={library.avatar}
              width={40}
            />
          ) : (
            <LibraryIcon size={40} />
          )}
        </div>
        <div className="flex flex-col overflow-auto">
          <p className="text-md truncate text-ellipsis">{library.name}</p>
          <p className="text-small text-default-500">{library.from || "acme.com"}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="h-[60px] text-ellipsis text-wrap">{library.description}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={`/library/${library.id}/settings`}>
          Visit more details.
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LibraryCard;
