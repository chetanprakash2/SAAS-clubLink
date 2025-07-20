import type { Member, Notice } from "@/types";

export const members: Member[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    avatar: "https://placehold.co/40x40.png?text=AJ",
    role: "Admin",
    joined: "2023-01-15",
    dataAiHint: "woman smiling"
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.s@example.com",
    avatar: "https://placehold.co/40x40.png?text=BS",
    role: "Member",
    joined: "2023-02-20",
    dataAiHint: "man glasses"
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    avatar: "https://placehold.co/40x40.png?text=CB",
    role: "Member",
    joined: "2023-03-10",
    dataAiHint: "man outdoor"
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.p@example.com",
    avatar: "https://placehold.co/40x40.png?text=DP",
    role: "Member",
    joined: "2023-05-01",
    dataAiHint: "woman portrait"
  },
  {
    id: "5",
    name: "Ethan Hunt",
    email: "ethan.h@example.com",
    avatar: "https://placehold.co/40x40.png?text=EH",
    role: "Admin",
    joined: "2022-11-11",
    dataAiHint: "man serious"
  },
    {
    id: "6",
    name: "Fiona Glenanne",
    email: "fiona.g@example.com",
    avatar: "https://placehold.co/40x40.png?text=FG",
    role: "Member",
    joined: "2024-06-25",
    dataAiHint: "woman redhead"
  },
];

export const notices: Notice[] = [
  {
    id: "1",
    title: "Annual Club Elections",
    content: "Nominations for all board positions are now open. Please submit your nominations by the end of the month. The election will be held during our next general meeting.",
    author: "Alice Johnson",
    date: "2024-07-01",
  },
  {
    id: "2",
    title: "Summer Picnic Announcement",
    content: "Get ready for our annual summer picnic! It will be held at Central Park on July 20th. Food, drinks, and games will be provided. Please RSVP by July 10th so we can get a headcount.",
    author: "Ethan Hunt",
    date: "2024-06-28",
  },
  {
    id: "3",
    title: "New Workshop: Advanced Pottery Techniques",
    content: "We are excited to announce a new workshop focused on advanced pottery throwing and glazing techniques. The workshop starts next week and has limited spots. Sign up at the front desk.",
    author: "Alice Johnson",
    date: "2024-06-25",
  },
    {
    id: "4",
    title: "Clubhouse Maintenance",
    content: "The main hall will be closed for maintenance on Monday and Tuesday. All other facilities will remain open. We apologize for any inconvenience.",
    author: "Ethan Hunt",
    date: "2024-06-22",
  },
];
