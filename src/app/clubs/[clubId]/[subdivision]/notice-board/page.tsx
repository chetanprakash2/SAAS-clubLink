"use client";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Bell } from "lucide-react";

export default function NoticeBoardPage(props: { params: { subdivision: string }}) {
  const { params } = props;
  const [notices, setNotices] = useState<any[]>([]);
  const socketRef = useRef<any>(null);
  useEffect(() => {
    async function fetchNotices() {
      const res = await fetch(`http://localhost:5000/api/subdivisions/${params.subdivision}/notices`);
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      } else {
        setNotices([]);
      }
    }
    fetchNotices();

    // Setup Socket.IO for real-time notice updates
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000/notices");
      socketRef.current.emit("join_room", `${params.subdivision}-notices`);
      socketRef.current.on("notice_added", (notice: any) => {
        setNotices((prev) => [...prev, notice]);
      });
      socketRef.current.on("notice_updated", (updatedNotice: any) => {
        setNotices((prev) => prev.map(n => n._id === updatedNotice._id ? updatedNotice : n));
      });
      socketRef.current.on("notice_deleted", (deletedId: string) => {
        setNotices((prev) => prev.filter(n => n._id !== deletedId));
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [params.subdivision]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">{params.subdivision} Notice Board</h1>
        <p className="text-muted-foreground">
          Keep up to date with the latest announcements.
        </p>
      </div>
      <div className="space-y-4">
        {notices.map((notice: any) => (
          <Card key={notice._id || notice.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                <span>{notice.title}</span>
              </CardTitle>
              <CardDescription>
                Posted by {notice.author} on{" "}
                {format(new Date(notice.date), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{notice.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
