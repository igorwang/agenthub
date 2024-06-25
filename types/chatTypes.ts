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

export type SourceDTO = {
  sourceType: SOURCE_TYPE_ENUM;
  fileId: string;
  url: string;
  fileName: string;
  pages: number[];
  content: string;
};
