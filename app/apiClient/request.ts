import axios from "axios";

// import { getToken } from '../utils';
// const token = getToken();

export const hasuraApi = axios.create({
  baseURL: "/hasura",
  // headers: { Authorization: `Bearer ${token}` },
});

export const bizApi = axios.create({
  baseURL: "/api",
  // headers: { Authorization: `Bearer ${token}` },
});

export const openAiApi = axios.create({
  baseURL: "/",
  // headers: { Authorization: `Bearer ${token}` },
});
