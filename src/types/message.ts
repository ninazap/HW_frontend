export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
