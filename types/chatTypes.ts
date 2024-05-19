export type ChatDTO = {
  id: number;
  name: string;
  description?: string | null | undefined;
  avatar?: string | null | undefined; 
};

export type GroupedChatListDTO = {
  id: number;
  name: string;
  agents: ChatDTO[];
};
