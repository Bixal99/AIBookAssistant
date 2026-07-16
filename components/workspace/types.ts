import type { IBook, IReadingProgress } from "@/types";

export type WorkspaceBook = IBook & {
  readingProgress: IReadingProgress;
};

export type WorkspaceChapter = {
  id: string;
  title: string;
  page: number;
};

export type ViewerFitMode = "width" | "page";
