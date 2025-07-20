"use client";
import React, { useEffect, useState } from "react";
import { Music, Gamepad2, PlusCircle, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Map icon strings to actual Lucide icons
  const iconMap: Record<string, React.ElementType> = {
    Music,
    Gamepad2,
  };

  useEffect(() => {
    async function fetchUserClubs() {
      try {
        const userId = localStorage.getItem("userId"); // You can change this if you use Auth Context

        if (!userId) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

     const res = await fetch(`http://localhost:5000/api/clubs/user/${userId}/clubs`);


        if (!res.ok) throw new Error("Failed to fetch clubs");

        const data = await res.json();
        setClubs(data);
      } catch (err: any) {
        setError(err.message || "Error fetching clubs");
      } finally {
        setLoading(false);
      }
    }

    fetchUserClubs();
  }, []);

  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Clubs</h1>
          <p className="text-muted-foreground">Clubs you have already joined.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/clubs/create"
            className="inline-flex items-center gap-2 rounded-md border border-primary px-3 py-2 text-primary hover:bg-primary hover:text-white transition"
          >
            <PlusCircle className="h-4 w-4" />
            Create Club
          </Link>
          <Button asChild>
            <Link href="/explore" className="inline-flex items-center gap-2">
              <Globe className="mr-2 h-4 w-4" />
              Explore Clubs
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {clubs.length === 0 ? (
          <p>No clubs joined yet.</p>
        ) : (
          clubs.map((club: any) => (
            <Link href={`/clubs/${club.slug}`} key={club._id} className="group">
              <Card className="h-full transform transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/20">
                <CardHeader className="items-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {club.icon && iconMap[club.icon] ? (
                      React.createElement(iconMap[club.icon], {
                        className: "h-10 w-10 text-primary",
                      })
                    ) : (
                      <Gamepad2 className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold">{club.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  <p>{club.members.length} members</p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
