export type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Member";
  joined: string; // date string
  dataAiHint: string;
};

export type Notice = {
  id:string;
  title: string;
  content: string;
  author: string;
  date: string; // date string
};
