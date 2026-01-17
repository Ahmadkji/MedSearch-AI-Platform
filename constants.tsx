
import React from 'react';
import { LayoutDashboard, Folder, Library, PlusCircle, Search, Bell, Settings, Share2, PanelRight, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';

export const COLORS = {
  primary: '#2563eb',
  sidebarBg: '#ffffff',
  contentBg: '#f8fafc',
  border: '#e2e8f0',
  textMain: '#0f172a',
  textSecondary: '#64748b'
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
  { id: 'projects', label: 'Projects', icon: <Folder size={20} />, active: false },
  { id: 'library', label: 'Library', icon: <Library size={20} />, active: false },
];

export const RECENT_HISTORY = [
  "JAK inhibitors efficacy",
  "mRNA vaccine durability",
  "CRISPR off-target effects"
];

export const TREND_DATA = [
  { year: 2019, count: 20 },
  { year: 2020, count: 45 },
  { year: 2021, count: 60 },
  { year: 2022, count: 110 },
  { year: 2023, count: 142 },
];
