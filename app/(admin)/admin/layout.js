import { getAdmin } from "@/actions/admin";
import { notFound } from "next/navigation";
import AdminShell from "./_components/admin-shell";

const AdminLayout = async ({ children }) => {
  const admin = await getAdmin();

  if (!admin.authorized) {
    return notFound();
  }

  const user = admin.user;

  return (
    <AdminShell
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
