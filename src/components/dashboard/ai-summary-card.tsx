
"use client";
import React from "react";
import { use as usePromise } from "react";
import io from "socket.io-client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { summarizeClubActivity, type SummarizeClubActivityInput } from "@/ai/flows/summarize-club-activity";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  recentAnnouncements: z.string().min(1, { message: "Please provide some recent announcements." }),
  newMembers: z.string().min(1, { message: "Please list new members or type 'none'." }),
  activeTopics: z.string().min(1, { message: "Please list active topics or type 'none'." }),
});



import { useParams } from "next/navigation";

export function AiSummaryCard() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState("");
  const [newMembers, setNewMembers] = useState("");
  const [activeTopics, setActiveTopics] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [meetingStatus, setMeetingStatus] = useState<string>("");
  const socketRef = React.useRef<any>(null);
  const paramsMaybePromise = useParams();
  // Unwrap params if it's a Promise (Next.js 14+)
  const params = typeof paramsMaybePromise === "object" && paramsMaybePromise !== null && "then" in paramsMaybePromise ? usePromise(paramsMaybePromise) as Record<string, any> : paramsMaybePromise as Record<string, any>;
  const subdivision = typeof params?.subdivision === "string" ? params.subdivision : Array.isArray(params?.subdivision) ? params.subdivision[0] : "music";

  useEffect(() => {
    async function fetchData() {
      // Fetch notices
      const noticesRes = await fetch(`http://localhost:5000/api/subdivisions/${subdivision}/notices`);
      const notices = await noticesRes.json();
      setAnnouncements(
        (notices as Array<{ title: string }>).map((n: { title: string }, i: number) => `${i + 1}. ${n.title}`).join("\n")
      );
      // Fetch members
      const membersRes = await fetch(`http://localhost:5000/api/subdivisions/${subdivision}/members`);
      const members = await membersRes.json();
      setNewMembers(
        (members as Array<{ name: string }>).map((m: { name: string }, i: number) => `${i + 1}. ${m.name}`).join("\n")
      );
      // Fetch active topics from chat API
      const topicsRes = await fetch(`http://localhost:5000/api/subdivisions/${subdivision}/topics`);
      if (topicsRes.ok) {
        const topics = await topicsRes.json();
        setActiveTopics((topics as Array<{ topic: string }>).map((t: { topic: string }, i: number) => `${i + 1}. ${t.topic}`).join("\n"));
      } else {
        setActiveTopics("No active topics found.");
      }
    }
    fetchData();

    // Setup Socket.IO for chat and meetings
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000/chat");
      socketRef.current.emit("join_room", `${subdivision}-chat`);
      socketRef.current.on("receive_message", (message: any) => {
        setChatMessages((prev) => [...prev, `${message.user.name}: ${message.text}`]);
      });
    }
    // Meeting namespace
    if (!socketRef.current?.meeting) {
      socketRef.current.meeting = io("http://localhost:5000/meeting");
      socketRef.current.meeting.emit("join_meeting", `${subdivision}-meeting`);
      socketRef.current.meeting.on("user_joined", (id: string) => {
        setMeetingStatus((prev) => prev + `User joined: ${id}\n`);
      });
      socketRef.current.meeting.on("user_left", (id: string) => {
        setMeetingStatus((prev) => prev + `User left: ${id}\n`);
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        if (socketRef.current.meeting) socketRef.current.meeting.disconnect();
      }
    };
  }, [subdivision]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recentAnnouncements: "",
      newMembers: "",
      activeTopics: "",
    },
  });

  useEffect(() => {
    form.reset({
      recentAnnouncements: announcements,
      newMembers: newMembers,
      activeTopics: activeTopics,
    });
  }, [announcements, newMembers, activeTopics]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary("");
    try {
      const result = await summarizeClubActivity(values as SummarizeClubActivityInput);
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI Club Activity Summarizer</span>
        </CardTitle>
        <CardDescription>
          Generate a concise summary of recent club activities. Fill in the details below or use the pre-filled examples.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="recentAnnouncements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Announcements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List recent announcements..." className="min-h-[150px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Members</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List new members..." className="min-h-[150px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activeTopics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active Topics</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List active topics from chat..." className="min-h-[150px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {summary && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Generated Summary</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">{summary}</AlertDescription>
              </Alert>
            )}
            {/* Chat messages display */}
            {chatMessages.length > 0 && (
              <Alert>
                <AlertTitle>Live Chat</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">
                  {chatMessages.join("\n")}
                </AlertDescription>
              </Alert>
            )}
            {/* Meeting status display */}
            {meetingStatus && (
              <Alert>
                <AlertTitle>Meeting Status</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">{meetingStatus}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
