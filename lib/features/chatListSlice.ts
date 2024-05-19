import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatDTO, GroupedChatListDTO } from "../../types/chatTypes";
import { RootState } from "../store";

interface ChatListState {
  chatList: GroupedChatListDTO[];
  selectedChatId: number | null;
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
    selectChat: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
    },
    
  },
});
export const { setChatList, selectChat } = chatListSlice.actions;

export const selectChatList = (state: RootState): GroupedChatListDTO[] =>
  state.chatList.chatList;
export const selectSelectedChatId = (state: RootState): number | null =>
  state.chatList.selectedChatId;

export default chatListSlice.reducer;
