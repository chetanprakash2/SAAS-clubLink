'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function CreateClubPage() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Music'); // default icon
  const router = useRouter();

 const handleCreate = async () => {
  const userId = localStorage.getItem("userId"); // ✅ fetch userId

  if (!userId) {
    alert("User not logged in.");
    return;
  }

  const res = await fetch('http://localhost:5000/api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon, userId }), // ✅ send userId
  });

  if (res.ok) {
    router.push('/clubs'); // go to MyClubs
  } else {
    alert('Failed to create club');
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 space-y-4 p-4">
      <h1 className="text-2xl font-bold">Create a New Club</h1>

      <div className="space-y-2">
        <Label htmlFor="name">Club Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
        <p className="text-xs text-muted-foreground">Use icon name like: Music, Cpu, Clapperboard</p>
      </div>

      <Button onClick={handleCreate} disabled={!name.trim()}>
        Create Club
      </Button>
    </div>
  );
}
