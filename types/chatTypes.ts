import {
  Knowledge_Base_Type_Enum,
  Message_Status_Enum,
  Role_Enum,
  Run_Type_Enum,
  Tool_Type_Enum,
} from "@/graphql/generated/types";

export enum CHAT_STATUS_ENUM {
  New,
  Analyzing,
  Searching,
  Generating,
  Interpret,
  Finished,
}

export enum CHAT_MODE {
  simple,
  deep,
  creative,
}

export enum SOURCE_TYPE_ENUM {
  file,
  webpage,
  video,
}

export type ChatDTO = {
  id: string;
  name: string;
  description?: string | null | undefined;
  avatar?: string | null | undefined;
  role?: string | Role_Enum;
};

export type GroupedChatListDTO = {
  id: number;
  name: string;
  agents: ChatDTO[];
};

export type SourceType = {
  sourceType: SOURCE_TYPE_ENUM;
  fileId: string;
  url: string;
  fileName: string;
  title?: string;
  pages: number[];
  contents: string[];
  knowledgeBaseId?: string;
  index?: number;
  metadata?: string | null;
  ext?: string;
  content?: string;
};

export type MessageType = {
  id: string;
  role: string;
  message?: string | null;
  feedback?: string | null;
  status?: string | null | Message_Status_Enum;
  files?: any;
  sources?: SourceType[];
  query?: string;
  sessionId?: string;
};

export type LibraryCardType = {
  id: string;
  base_type: Knowledge_Base_Type_Enum;
  name?: string;
  from?: string;
  avatar?: string;
  description?: string;
  creator?: string;
  isNew?: boolean;
  updatedAt?: string;
};

export type ToolType = {
  id: number;
  name: string;
  tool_type: Tool_Type_Enum;
  run_type: Run_Type_Enum;
  output_schema?: object | null;
};

export type SchemaPropertyType = {
  type: string;
  title: string;
  order?: number;
};

export type SchemaType = {
  type: string;
  title: string;
  properties: {
    [key: string]: SchemaPropertyType;
  };
  description: string;
};
