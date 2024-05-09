import { title } from "@/components/primitives";
import { auth } from "@/auth";

export default async function BlogPage() {
  const session = await auth();

  return (
    <div>
      <h1 className={title()}>Blog</h1>
    </div>
  );
}
