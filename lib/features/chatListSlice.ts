import { FilesListQuery } from "@/graphql/generated/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CHAT_STATUS_ENUM,
  ChatSessionContext,
  GroupedChatListDTO,
  SourceType,
} from "../../types/chatTypes";
import { RootState } from "../store";

interface ChatListState {
  chatList: GroupedChatListDTO[];
  selectedChatId: string | null;
  selectedSessionId: string | null;
  selectedSources: SourceType[];
  isFollowUp: boolean;
  isChangeSession: boolean;
  refreshSession: boolean;
  isAircraftOpen: boolean;
  isAircraftGenerating: boolean;
  isChating: boolean;
  chatStatus: CHAT_STATUS_ENUM | null;
  chatSessionContext: ChatSessionContext | null;
  sessionFiles: FilesListQuery["files"];
}

const initialState: ChatListState = {
  chatList: [
    {
      id: 0,
      name: "",
      agents: [],
    },
  ],
  isChating: false,
  chatStatus: null,
  selectedChatId: null,
  selectedSessionId: null,
  isFollowUp: false,
  isChangeSession: false,
  refreshSession: false,
  selectedSources: [],
  chatSessionContext: null,
  isAircraftGenerating: false,
  isAircraftOpen: false,
  sessionFiles: [],
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
    setChatSessionContext: (state, action: PayloadAction<ChatSessionContext | null>) => {
      state.chatSessionContext = action.payload;
    },
    setIsAircraftGenerating: (state, action: PayloadAction<boolean>) => {
      state.isAircraftGenerating = action.payload;
    },
    setIsAircraftOpen: (state, action: PayloadAction<boolean>) => {
      state.isAircraftOpen = action.payload;
    },
    setIsChating: (state, action: PayloadAction<boolean>) => {
      state.isChating = action.payload;
    },
    setChatStatus: (state, action: PayloadAction<CHAT_STATUS_ENUM | null>) => {
      state.chatStatus = action.payload;
    },
    setSessionFiles: (state, action: PayloadAction<FilesListQuery["files"]>) => {
      state.sessionFiles = action.payload;
    },

    setSelectedSources: (state, action: PayloadAction<SourceType[]>) => {
      state.selectedSources = action.payload;
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
  setChatSessionContext,
  setIsAircraftGenerating,
  setIsAircraftOpen,
  setIsChating,
  setChatStatus,
  setSessionFiles,
  setSelectedSources,
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
export const selectChatSessionContext = (state: RootState): ChatSessionContext | null =>
  state.chatList.chatSessionContext;
export const selectIsAircraftGenerating = (state: RootState): boolean =>
  state.chatList.isAircraftGenerating;
export const selectIsAircraftOpen = (state: RootState): boolean =>
  state.chatList.isAircraftOpen;
export const selectIsChating = (state: RootState): boolean => state.chatList.isChating;
export const selectChatStatus = (state: RootState): CHAT_STATUS_ENUM | null =>
  state.chatList.chatStatus;
export const selectSessionFiles = (state: RootState): FilesListQuery["files"] =>
  state.chatList.sessionFiles;
export const selectSelectedSources = (state: RootState): SourceType[] =>
  state.chatList.selectedSources;
export default chatListSlice.reducer;
