import { getUserById } from "@/actions/getUserById";
import UserProfileForm from "@/components/auth/UserProfileForm";
import { currentUser } from "@/lib/auth";

interface PublicProfilePage {
  params: {
    userId: string;
  };
}
const PublicProfilePage = async ({ params }: PublicProfilePage) => {
  const dbUser = await getUserById(params.userId);
  const user = await currentUser();

  if (!user) return <div>Not authenticated...</div>;
  return <UserProfileForm dbUser={dbUser} />;
};

export default PublicProfilePage;
