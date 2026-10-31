import { getAdmin } from "@/actions/admin";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AdminShell from "./_components/admin-shell";

const AdminLayout = async ({ children }) => {
  const admin = await getAdmin();

  if (!admin.authorized) {
    return notFound();
  }

  const user = admin.user;
  const jar = await cookies();
  const stored = jar.get("sidebar_state")?.value;
  const defaultOpen = stored === undefined ? true : stored === "true";

  return (
    <AdminShell
      defaultOpen={defaultOpen}
      user={{
        name: user?.name || "",
        email: user?.email || "",
        imageUrl: user?.imageUrl || "",
      }}
    >
      {children}
    </AdminShell>
  );
};

export default AdminLayout;
