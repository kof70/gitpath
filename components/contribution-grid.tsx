"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format, subDays, startOfToday } from "date-fns";
import { fr } from "date-fns/locale";
import { CommitSchedule } from "./commit-schedule";

interface ContributionGridProps {
  selectedTool: "heart" | "car" | "star" | "pixel" | "text";
  intensity: 0 | 1 | 2 | 3 | 4;
}

const WEEKS = 53;
const DAYS = 7;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

// Font data for text rendering (5x7 pixel font)
const FONT: Record<string, number[][]> = {
  'L': [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  'O': [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  'V': [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  'E': [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
};

// Predefined shapes as 2D arrays
const SHAPES = {
  car: [
    [0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
  ],
  heart: [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  star: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
  ],
};

export function ContributionGrid({ selectedTool, intensity }: ContributionGridProps) {
  const [grid, setGrid] = useState<number[][]>(
    Array(WEEKS).fill(0).map(() => Array(DAYS).fill(0))
  );
  const [previewGrid, setPreviewGrid] = useState<number[][]>(
    Array(WEEKS).fill(0).map(() => Array(DAYS).fill(0))
}
