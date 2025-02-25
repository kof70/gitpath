"use client";

import { CarIcon, HeartIcon, StarIcon, MousePointerClick, TypeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolPanelProps {
  selectedTool: "heart" | "car" | "star" | "pixel" | "text";
  onToolChange: (tool: "heart" | "car" | "star" | "pixel" | "text") => void;
  intensity: 0 | 1 | 2 | 3 | 4;
  onIntensityChange: (intensity: 0 | 1 | 2 | 3 | 4) => void;
}

export function ToolPanel({
  selectedTool,
  onToolChange,
  intensity,
  onIntensityChange,
}: ToolPanelProps) {
  const tools = [
    { id: "pixel" as const, icon: MousePointerClick, label: "Pixel" },
    { id: "text" as const, icon: TypeIcon, label: "Text" },
    { id: "heart" as const, icon: HeartIcon, label: "Heart" },
    { id: "car" as const, icon: CarIcon, label: "Car" },
    { id: "star" as const, icon: StarIcon, label: "Star" },
  ];

  const intensityLevels = [0, 1, 2, 3, 4] as const;
  const intensityColors = [
    "bg-[#ebedf0] dark:bg-[#161b22]",
    "bg-[#9be9a8] dark:bg-[#0e4429]",
    "bg-[#40c463] dark:bg-[#006d32]",
    "bg-[#30a14e] dark:bg-[#26a641]",
    "bg-[#216e39] dark:bg-[#39d353]",
  ];

  return (
    <div className="bg-card/30 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-border/50 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Tools</h2>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg transition-colors",
                selectedTool === tool.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <tool.icon className="w-6 h-6" />
              <span className="text-sm">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Intensity</h2>
        <div className="flex gap-2">
          {intensityLevels.map((level) => (
            <button
              key={level}
              onClick={() => onIntensityChange(level)}
              className={cn(
                "w-8 h-8 rounded transition-transform",
                intensityColors[level],
                intensity === level && "scale-110 ring-2 ring-primary"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}