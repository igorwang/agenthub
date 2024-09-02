import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupedChatListDTO } from "../../types/chatTypes";
import { RootState } from "../store";

interface ChatListState {
  chatList: GroupedChatListDTO[];
  selectedChatId: string | null;
  selectedSessionId: string | null;
  isFollowUp: boolean;
  isChangeSession: boolean;
  refreshSession: boolean;
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
  isFollowUp: false,
  isChangeSession: false,
  refreshSession: false,
};

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    setChatList: (state, action: PayloadAction<GroupedChatListDTO[]>) => {
      state.chatList = action.payload;
    },
    selectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
    },
    selectSession: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload;
    },
    setIsFollowUp: (state, action: PayloadAction<boolean>) => {
      state.isFollowUp = action.payload;
    },
    setIsChangeSession: (state, action: PayloadAction<boolean>) => {
      state.isChangeSession = action.payload;
    },
    setRefreshSession: (state, action: PayloadAction<boolean>) => {
      state.refreshSession = action.payload;
    },
  },
});

export const {
  setChatList,
  selectChat,
  selectSession,
  setIsFollowUp,
  setIsChangeSession,
  setRefreshSession,
} = chatListSlice.actions;

export const selectChatList = (state: RootState): GroupedChatListDTO[] =>
  state.chatList.chatList;
export const selectSelectedChatId = (state: RootState): string | null =>
  state.chatList.selectedChatId;
export const selectSelectedSessionId = (state: RootState): string | null =>
  state.chatList.selectedSessionId;
export const selectIsFollowUp = (state: RootState): boolean => state.chatList.isFollowUp;
export const selectIsChangeSession = (state: RootState): boolean =>
  state.chatList.isChangeSession;
export const selectRefreshSession = (state: RootState): boolean =>
  state.chatList.refreshSession;

export default chatListSlice.reducer;
