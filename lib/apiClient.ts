import { OpenAPI } from "@/restful/generated";

// 获取环境变量并进行类型检查
const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error("API_URL is not defined");
}

// 配置 API 基础 URL
OpenAPI.BASE = apiUrl;
