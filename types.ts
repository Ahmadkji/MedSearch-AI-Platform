
export interface ResearchData {
  query: string;
  foundArticles: number;
  filteredArticles: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PublicationTrend {
  year: number;
  count: number;
}

export interface Paper {
  id: number;
  title: string;
  authors: string;
  journal: string;
  date: string;
  citations: number;
  abstract: string;
  tags: string[];
  url?: string;
}

export interface Project {
  id: string;
  query: string;
  papers: Paper[];
  summary: string | null;
  timestamp: number;
}

export interface LibraryItem {
  id: string;
  paper: Paper;
  savedAt: number;
}
