import liveblocks from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/sign-in');
  }


  const { id, firstName, lastName, imageUrl, emailAddresses } = clerkUser;

  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      avatar: imageUrl,
      email: emailAddresses[0].emailAddress,
      color: getUserColor(id)
    }

  }

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}