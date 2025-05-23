"use client";

import {
  getDealershipInfo,
  getUsers,
  saveWorkingHours,
  updateUserRole,
} from "@/actions/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";

// Day names for display
const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const SettingsForm = () => {
  const [workingHours, setWorkingHours] = useState(
    DAYS.map((day) => ({
      dayOfWeek: day.value,
      openTime: "09:00",
      closeTime: "18:00",
      isOpen: day.value !== "SUNDAY",
    }))
  );

    const [userSearch, setUserSearch] = useState("");


  // Custom hooks for API calls
  const {
    loading: fetchingSettings,
    fn: fetchDealershipInfo,
    data: settingsData,
    error: settingsError,
  } = useFetch(getDealershipInfo);

  const {
    loading: savingHours,
    fn: saveHours,
    data: saveResult,
    error: saveError,
  } = useFetch(saveWorkingHours);

  const {
    loading: fetchingUsers,
    fn: fetchUsers,
    data: usersData,
    error: usersError,
  } = useFetch(getUsers);

  const {
    loading: updatingRole,
    fn: updateRole,
    data: updateRoleResult,
    error: updateRoleError,
  } = useFetch(updateUserRole);

  useEffect(() => {
    fetchDealershipInfo();
    fetchUsers();
  }, []);
  return (
    <div className="space-y-6">
      <Tabs defaultValue="hours" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="hours">
            <Clock className="w-4 h-4 mr-2" /> Working Hours
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="w-4 h-4 mr-2" /> Admin Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hours" className="space-y-6 mt-6">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="admins" className="space-y-6 mt-6">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
