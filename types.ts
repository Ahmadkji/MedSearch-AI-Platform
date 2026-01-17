
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
