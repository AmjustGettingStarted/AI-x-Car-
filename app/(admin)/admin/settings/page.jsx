import { BRAND_NAME } from "@/lib/brand";
import SettingsForm from "./_components/settings-form";

export const metadata = {
  title: `Settings | ${BRAND_NAME}`,
  description: "Manage dealership working hours and admin users",
};

const SettingsPage = () => {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight">
        Settings
      </h1>
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
