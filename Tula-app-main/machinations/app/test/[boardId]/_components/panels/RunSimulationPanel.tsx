"use client";

import { useState } from "react";
import { Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  isMarkovChainResult,
  isMonteCarloResult,
  useSimulationResults,
} from "@/app/store/use-simulation-results";

const SIMULATION_MODES = [
  { value: "MARKOV_CHAIN", label: "Markov Chain" },
  { value: "MONTE_CARLO", label: "Monte Carlo" },
  { value: "WEIGHT_RANDOM_WALK", label: "Weight Random Walk" },
  { value: "PROBABILISTIC_AUTOMATION", label: "Probabilistic Automation" },
] as const;

type SimulationMode = (typeof SIMULATION_MODES)[number]["value"];

interface RunSimulationPanelProps {
  boardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RunSimulationPanel = ({
  boardId,
  open,
  onOpenChange,
}: RunSimulationPanelProps) => {
  const [mode, setMode] = useState<SimulationMode>("MARKOV_CHAIN");
  const [steps, setSteps] = useState("100");
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const applyResult = useSimulationResults((state) => state.applyResult);

  const handleRun = async () => {
    const parsedSteps = Number(steps);

    if (!Number.isFinite(parsedSteps) || parsedSteps <= 0) {
      toast.error("Steps must be a positive number");
      return;
    }

    setIsRunning(true);
    setLastResult(null);

    try {
      const response = await fetch("/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId,
          mode,
          steps: parsedSteps,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Simulation request failed"
        );
      }

      const formattedResult = JSON.stringify(data.result ?? data, null, 2);
      setLastResult(formattedResult);

      const simulationResult = data.result ?? data;

      if (isMonteCarloResult(simulationResult) || isMarkovChainResult(simulationResult)) {
        applyResult(mode, simulationResult);
        onOpenChange(false);
        toast.success(`Simulation applied to board (v${data.boardVersion})`);
      } else {
        toast.success(`Simulation sent (board v${data.boardVersion})`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Simulation request failed";
      toast.error(message);
      setLastResult(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Run Simulation</DialogTitle>
          <DialogDescription>
            Sends the latest saved version from Convex boardsHistory to Java.
            Save the board first if you changed it recently.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="simulation-mode">Mode</Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as SimulationMode)}
            >
              <SelectTrigger id="simulation-mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {SIMULATION_MODES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="simulation-steps">Steps</Label>
            <Input
              id="simulation-steps"
              type="number"
              min={1}
              value={steps}
              onChange={(event) => setSteps(event.target.value)}
            />
          </div>

          {lastResult && (
            <div className="grid gap-2">
              <Label>Response</Label>
              <pre className="max-h-48 overflow-auto rounded-md border bg-muted p-3 text-xs">
                {lastResult}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            Run
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
