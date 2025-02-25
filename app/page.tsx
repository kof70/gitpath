"use client";

import { useState } from "react";
import { ContributionGrid } from "@/components/contribution-grid";
import { ToolPanel } from "@/components/tool-panel";
import { ImageDropzone } from "@/components/image-dropzone";
import { GithubIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<"heart" | "car" | "star" | "pixel" | "text">("pixel");
  const [intensity, setIntensity] = useState<0 | 1 | 2 | 3 | 4>(1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/95 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <GithubIcon className="w-10 h-10" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              GitHub Contribution Designer
            </h1>
            <div className="absolute right-6 top-6">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create beautiful contribution patterns that look like GitHub's contribution graph. Design custom patterns, use predefined shapes, or import images.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          <ToolPanel
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            intensity={intensity}
            onIntensityChange={setIntensity}
          />
          <div className="space-y-6">
            <ContributionGrid
              selectedTool={selectedTool}
              intensity={intensity}
            />
            <ImageDropzone />
          </div>
        </div>
      </div>
    </main>
  );
}