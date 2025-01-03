import ThemeToggle from "@/app/components/ThemeToggle";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TopMenu() {
  const { user } = await validateRequest();

  if (!user) return redirect("/login");
  if (user.is_admin !== 1) return redirect("/");

  return (
    <div className="md:py-5 flex justify-end">
      Hello {user.username}
      <div className="pl-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
