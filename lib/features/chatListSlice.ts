import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatDTO, GroupedChatListDTO } from "../../types/chatTypes";
import { RootState } from "../store";

interface ChatListState {
  chatList: GroupedChatListDTO[];
  selectedChatId: string | null;
  selectedSessionId: string | null;
}

const initialState: ChatListState = {
  chatList: [
    {
      id: 0,
      name: "",
      agents: [],
    },
  ],
  selectedChatId: null,
  selectedSessionId: null,
};

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    setChatList: (state, action: PayloadAction<GroupedChatListDTO[]>) => {
      state.chatList = action.payload;
      if (action.payload.length > 0 && action.payload[0].agents.length > 0) {
        state.selectedChatId = action.payload[0].agents[0].id;
      } else {
        state.selectedChatId = null;
      }
    },
    selectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
    },
    selectSession: (state, action: PayloadAction<string>) => {
      state.selectedSessionId = action.payload;
    },
  },
});
export const { setChatList, selectChat, selectSession } = chatListSlice.actions;

export const selectChatList = (state: RootState): GroupedChatListDTO[] =>
  state.chatList.chatList;
export const selectSelectedChatId = (state: RootState): string | null =>
  state.chatList.selectedChatId;
export const selectSelectedSessionId = (state: RootState): string | null =>
  state.chatList.selectedSessionId;

export default chatListSlice.reducer;
