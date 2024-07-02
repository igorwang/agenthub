import { redirect } from "next/navigation";

const generateShortId = () => {
  // 使用日期时间戳和随机数来生成唯一标识符
  return Math.random().toString(36).slice(2, 10);
};
export default function SearchPage() {
  const id = generateShortId();
  console.log(generateShortId);
  redirect(`/search/${id}`);
  return null;
}
