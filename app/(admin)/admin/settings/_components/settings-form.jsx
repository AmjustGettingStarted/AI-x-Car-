"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield } from "lucide-react";
import React from "react";

const SettingsForm = () => {
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
