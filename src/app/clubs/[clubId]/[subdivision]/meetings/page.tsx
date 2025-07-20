"use client";

import { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function MeetingsClientPage({ subdivision }: { subdivision: string }) {
  const { toast } = useToast();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        setIsCameraOn(true);
        setIsMicOn(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        setIsCameraOn(false);
        setIsMicOn(false);
        toast({
          variant: 'destructive',
          title: 'Media Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };
    getCameraPermission();

    // Setup Socket.IO for meeting events
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000/meeting");
      socketRef.current.emit("join_meeting", `${subdivision}-meeting`);
      socketRef.current.on("user_joined", (id: string) => {
        setMeetingStatus((prev) => prev + `User joined: ${id}\n`);
      });
      socketRef.current.on("user_left", (id: string) => {
        setMeetingStatus((prev) => prev + `User left: ${id}\n`);
      });
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [toast, subdivision]);
  
  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };
  
  const toggleMic = () => {
     if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
       <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">Virtual Meeting: {subdivision}</h1>
        <p className="text-muted-foreground">
          Connect with your fellow club members face-to-face.
        </p>
      </div>

      <div className="flex-1 grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Main Stage</CardTitle>
              <CardDescription>Your video feed</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center bg-muted/50 rounded-b-lg relative">
              <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
              {!hasCameraPermission && (
                  <Alert variant="destructive" className="absolute bottom-4 left-4 right-4 w-auto">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access to use this feature.
                    </AlertDescription>
                  </Alert>
              )}
               {!isCameraOn && hasCameraPermission && (
                 <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                    <div className="text-center">
                      <VideoOff className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Camera is off</p>
                    </div>
                 </div>
              )}
            </CardContent>
             <div className="flex justify-center items-center gap-4 p-4 border-t">
                <Button onClick={toggleMic} variant={isMicOn ? "outline" : "destructive"} size="icon" className="rounded-full h-12 w-12">
                  {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>
                <Button onClick={toggleCamera} variant={isCameraOn ? "outline" : "destructive"} size="icon" className="rounded-full h-12 w-12">
                  {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>
                 <Button variant="destructive" size="icon" className="rounded-full h-12 w-12">
                    <PhoneOff className="h-6 w-6" />
                </Button>
            </div>
          </Card>
        </div>
        <div>
          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Participants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                    <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                        <video className="w-full h-full object-cover rounded-md" autoPlay muted playsInline data-ai-hint="person meeting" src="https://placehold.co/160x90.png"></video>
                    </div>
                  </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function MeetingsPage({ params }: { params: Promise<{ subdivision: string }> }) {
  const { subdivision } = React.use(params);
  return <MeetingsClientPage subdivision={subdivision} />;
}
