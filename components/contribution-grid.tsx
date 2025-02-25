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
const FONT = {
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
  );
  const [hoveredCell, setHoveredCell] = useState<{ week: number; day: number } | null>(null);
  const [text, setText] = useState("LOVE");
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const getDateForCell = (week: number, day: number) => {
    const today = startOfToday();
    const totalDays = (WEEKS - week - 1) * 7 + (DAYS - day - 1);
    return subDays(today, totalDays);
  };

  const createTextPattern = (text: string) => {
    const letters = text.toUpperCase().split('');
    let pattern: number[][] = [];
    
    // Initialize the pattern with the height of the font
    for (let i = 0; i < 5; i++) {
      pattern[i] = [];
    }
    
    // Add each letter with a space between them
    letters.forEach((letter, letterIndex) => {
      const letterPattern = FONT[letter];
      if (letterPattern) {
        // Add the letter pattern
        for (let y = 0; y < letterPattern.length; y++) {
          pattern[y].push(...letterPattern[y]);
          // Add a space between letters
          if (letterIndex < letters.length - 1) {
            pattern[y].push(0);
          }
        }
      }
    });
    
    return pattern;
  };

  const applyShape = (weekIndex: number, dayIndex: number, shape: number[][], preview = false) => {
    const targetGrid = preview ? [...previewGrid] : [...grid];
    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;
    
    // Calculate starting position to center the shape
    const startWeek = weekIndex - Math.floor(shapeWidth / 2);
    const startDay = dayIndex - Math.floor(shapeHeight / 2);
    
    // Apply the shape
    for (let y = 0; y < shapeHeight; y++) {
      for (let x = 0; x < shapeWidth; x++) {
        const targetWeek = startWeek + x;
        const targetDay = startDay + y;
        
        if (
          targetWeek >= 0 &&
          targetWeek < WEEKS &&
          targetDay >= 0 &&
          targetDay < DAYS &&
          shape[y][x] === 1
        ) {
          targetGrid[targetWeek][targetDay] = preview ? intensity : intensity;
        }
      }
    }
    
    if (preview) {
      setPreviewGrid(targetGrid);
    } else {
      setGrid(targetGrid);
    }
  };

  const handleCellClick = (week: number, day: number) => {
    if (selectedTool === "pixel") {
      const newGrid = [...grid];
      newGrid[week][day] = intensity;
      setGrid(newGrid);
    } else if (selectedTool === "text") {
      const textPattern = createTextPattern(text);
      applyShape(week, day, textPattern);
    } else {
      const shape = SHAPES[selectedTool];
      if (shape) {
        applyShape(week, day, shape);
      }
    }
  };

  const handleCellHover = (week: number, day: number, event: React.MouseEvent) => {
    setHoveredCell({ week, day });
    
    // Update tooltip
    const date = getDateForCell(week, day);
    const formattedDate = format(date, "d MMMM yyyy", { locale: fr });
    const contributions = grid[week][day];
    const contributionText = contributions === 1 ? "contribution" : "contributions";
    
    setTooltipContent(
      `${formattedDate}\n${contributions} ${contributionText}`
    );
    
    // Position tooltip
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 40
    });
    setShowTooltip(true);
    
    // Clear previous preview
    setPreviewGrid(Array(WEEKS).fill(0).map(() => Array(DAYS).fill(0)));
    
    // Show shape preview if a shape tool is selected
    if (selectedTool === "text") {
      const textPattern = createTextPattern(text);
      applyShape(week, day, textPattern, true);
    } else if (selectedTool !== "pixel") {
      const shape = SHAPES[selectedTool];
      if (shape) {
        applyShape(week, day, shape, true);
      }
    }
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
    setShowTooltip(false);
    setPreviewGrid(Array(WEEKS).fill(0).map(() => Array(DAYS).fill(0)));
  };

  const getCellColor = (value: number, isPreview: boolean = false) => {
    const colors = [
      "bg-[#ebedf0] dark:bg-[#161b22]",
      "bg-[#9be9a8] dark:bg-[#0e4429]",
      "bg-[#40c463] dark:bg-[#006d32]",
      "bg-[#30a14e] dark:bg-[#26a641]",
      "bg-[#216e39] dark:bg-[#39d353]",
    ];
    const baseColor = colors[value];
    return isPreview ? `${baseColor} opacity-50` : baseColor;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card/30 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-border/50">
        <div className="flex">
          {/* Weekday Labels */}
          <div className="flex flex-col gap-[2px] mr-2 pt-6 text-sm text-muted-foreground">
            {WEEKDAYS.map((day, i) => (
              <div key={i} className="h-[10px] flex items-center justify-end pr-2">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1">
            {/* Month Labels */}
            <div className="flex text-sm text-muted-foreground mb-2">
              {MONTHS.map((month, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ textAlign: i === 0 ? "left" : "center" }}
                >
                  {month}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[2px] relative">
              {grid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((value, dayIndex) => (
                    <motion.button
                      key={`${weekIndex}-${dayIndex}`}
                      whileHover={{ scale: 1.2 }}
                      className={cn(
                        "w-[10px] h-[10px] rounded-sm transition-colors",
                        getCellColor(value),
                        previewGrid[weekIndex][dayIndex] > 0 && getCellColor(intensity, true)
                      )}
                      onClick={() => handleCellClick(weekIndex, dayIndex)}
                      onMouseEnter={(e) => handleCellHover(weekIndex, dayIndex, e)}
                      onMouseLeave={handleCellLeave}
                    />
                  ))}
                </div>
              ))}
              
              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="absolute bg-popover text-popover-foreground px-3 py-2 rounded-md text-sm whitespace-pre z-50 pointer-events-none shadow-md"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  {tooltipContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Commit Schedule Table */}
      <CommitSchedule grid={grid} getDateForCell={getDateForCell} />
    </div>
  );
}