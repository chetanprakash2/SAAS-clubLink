"use client";
import { Users, Bell, UserPlus } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AiSummaryCard } from "@/components/dashboard/ai-summary-card";
import { useEffect, useState } from "react";

import React from 'react';
export default function DashboardPage({ params }: { params: Promise<{ subdivision: string }> }) {
  const { subdivision } = React.use(params);
  const [members, setMembers] = useState<{ joined: string }[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [newMembersThisMonth, setNewMembersThisMonth] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const membersRes = await fetch(`http://localhost:5000/api/subdivisions/${subdivision}/members`);
      const membersData = await membersRes.json();
      setMembers(membersData);
      const today = new Date();
      setNewMembersThisMonth(
        membersData.filter((m: { joined: string }) => {
          const joinedDate = new Date(m.joined);
          return joinedDate.getMonth() === today.getMonth() && joinedDate.getFullYear() === today.getFullYear();
        }).length
      );
      const noticesRes = await fetch(`http://localhost:5000/api/subdivisions/${subdivision}/notices`);
      const noticesData = await noticesRes.json();
      setNotices(noticesData);
    }
    fetchData();
  }, [subdivision]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">{subdivision} Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your club.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Members" value={String(members.length)} icon={Users} />
        <StatCard title="Recent Notices" value={String(notices.length)} icon={Bell} />
        <StatCard title="New Members This Month" value={String(newMembersThisMonth)} icon={UserPlus} />
      </div>

      <AiSummaryCard />
    </div>
  );
}
