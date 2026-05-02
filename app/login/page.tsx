import { redirect } from "next/navigation";
import LoginPage from "./components/login";
import { verifyUser } from "@/libs/auth/actions/verify-user";

export default async function Page() {

  const { data, error } = await verifyUser()

  console.log({ error })

  if (data?.id) {
    redirect("/");
  }

  return <LoginPage />;
}
