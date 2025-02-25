"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CommitScheduleProps {
  grid: number[][];
  getDateForCell: (week: number, day: number) => Date;
}

export function CommitSchedule({ grid, getDateForCell }: CommitScheduleProps) {
  // Get all cells with contributions
  const scheduledCommits = grid.flatMap((week, weekIndex) =>
    week.map((value, dayIndex) => ({
      date: getDateForCell(weekIndex, dayIndex),
      commits: value,
      weekIndex,
      dayIndex,
    }))
  ).filter(item => item.commits > 0)
  .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (scheduledCommits.length === 0) {
    return (
      <div className="bg-card/30 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-border/50 mt-6">
        <h3 className="text-lg font-semibold mb-4">Programme des commits</h3>
        <p className="text-muted-foreground text-center py-4">
          Aucun commit programmé. Commencez à dessiner sur la grille !
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/30 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-border/50 mt-6">
      <h3 className="text-lg font-semibold mb-4">Programme des commits</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2 px-4 text-muted-foreground font-medium">Date</th>
              <th className="text-right py-2 px-4 text-muted-foreground font-medium">Commits prévus</th>
            </tr>
          </thead>
          <tbody>
            {scheduledCommits.map(({ date, commits }, index) => (
              <tr
                key={index}
                className="border-b border-border/10 hover:bg-muted/30 transition-colors"
              >
                <td className="py-2 px-4">
                  {format(date, "d MMMM yyyy", { locale: fr })}
                </td>
                <td className="py-2 px-4 text-right">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full bg-primary/10 text-primary-foreground">
                    {commits}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border/50 font-medium">
              <td className="py-2 px-4">Total</td>
              <td className="py-2 px-4 text-right">
                {scheduledCommits.reduce((sum, { commits }) => sum + commits, 0)} commits
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}