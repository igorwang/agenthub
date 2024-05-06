import { title } from "@/components/primitives";
import { auth } from "@/auth";

export default async function BlogPage() {
  const session = await auth();
  

  console.log(session?.access_token)

  console.log('111')

  return (
    <div>
      {/* {session && <p>Access Token: {session.accessToken}</p>} */}
      <h1 className={title()}>Blog</h1>
    </div>
  );
}
