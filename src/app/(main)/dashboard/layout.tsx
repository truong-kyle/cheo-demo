import Navbar from "@/components/ui/Navbar";
import { getCurrentUser } from "@/db/server/user";

const dashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { error, data } = await getCurrentUser();
  
  if (error) {
    console.error("Failed to get user:", error);
  }

  const userName = data?.user?.user_metadata?.first_name && data?.user?.user_metadata?.last_name
    ? `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name}`
    : "User";

  return (
    <div className="h-screen bg-[oklch(0.2_0_0)] w-full flex flex-col">
      <Navbar user={userName} />
      {children}
    </div>
  );
};

export default dashboardLayout;
