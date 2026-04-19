import type { Recipe } from "./recipe";

export type ChatRole = "user" | "nori";

export type ChatMessage =
  | { id: string; role: "user"; kind: "text"; text: string; createdAt: number }
  | { id: string; role: "nori"; kind: "text"; text: string; createdAt: number }
  | { id: string; role: "nori"; kind: "typing"; createdAt: number }
  | { id: string; role: "nori"; kind: "recipe"; recipe: Recipe; createdAt: number };
