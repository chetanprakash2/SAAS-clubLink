'use client';
import React from 'react';

import { useEffect, useState, useRef } from 'react';
import { Music, Clapperboard, Gamepad2, Cpu, Users, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import io from "socket.io-client";

const iconMap: Record<string, any> = {
  Music,
  Clapperboard,
  Gamepad2,
  Cpu,
};

export default function ExploreClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/clubs');
        if (!res.ok) throw new Error('Failed to fetch clubs');
        const data = await res.json();
        const userId = localStorage.getItem('userId');

        const enriched = data.map((club: any) => ({
          ...club,
          joined: club.members.includes(userId),
        }));

        setClubs(enriched);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setClubs([]);
      }
    };

    fetchClubs();

    // Setup Socket.IO
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000/clubs");

      socketRef.current.on("club_updated", (updatedClub: any) => {
        const userId = localStorage.getItem("userId");
        updatedClub.joined = updatedClub.members.includes(userId);
        setClubs((prev) =>
          prev.map((c) => (c._id === updatedClub._id ? updatedClub : c))
        );
      });

      socketRef.current.on("club_added", (newClub: any) => {
        const userId = localStorage.getItem("userId");
        newClub.joined = newClub.members.includes(userId);
        setClubs((prev) => [...prev, newClub]);
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Clubs</h1>
        <p className="text-muted-foreground">Find new communities to join.</p>
      </div>

      <div className="mb-8 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for clubs..." className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <Card key={club._id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                {iconMap[club.icon] ? (
                  React.createElement(iconMap[club.icon], { className: "h-8 w-8 text-primary" })
                ) : (
                  <Users className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <CardTitle>{club.name}</CardTitle>
                <CardDescription>{club.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{club.members.length} members</span>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                disabled={club.joined}
                onClick={() => {
                  if (socketRef.current && !club.joined) {
                    socketRef.current.emit("join_club", { clubId: club._id, userId: localStorage.getItem("userId") });
                  }
                }}
              >
                {club.joined ? "Already a Member" : "Request to Join"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
