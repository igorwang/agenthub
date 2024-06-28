export enum CHAT_STATUS_ENUM {
  Analyzing,
  Searching,
  Generating,
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
  pages: number[];
  contents: string[];
};

export type MessageType = {
  id: string;
  role: string;
  message?: string | null;
  feedback?: string | null;
  status?: string | null;
  files?: any;
  sources?: SourceType[];
};
