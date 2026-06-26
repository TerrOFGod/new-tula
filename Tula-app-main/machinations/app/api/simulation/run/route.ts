import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { buildBoardExportPayload } from "@/app/services/buildBoardExportPayload";

const SIMULATION_MODES = ["MARKOV_CHAIN", "MONTE_CARLO", "WEIGHT_RANDOM_WALK", "PROBABILISTIC_AUTOMATION"] as const;

type SimulationMode = (typeof SIMULATION_MODES)[number];

interface RunSimulationBody {
  boardId: string;
  mode: SimulationMode;
  steps: number;
}

const isSimulationMode = (value: string): value is SimulationMode =>
  SIMULATION_MODES.includes(value as SimulationMode);

export async function POST(request: Request) {
  const javaServiceUrl = process.env.JAVA_SERVICE_URL;

  if (!javaServiceUrl) {
    return Response.json(
      { error: "JAVA_SERVICE_URL is not configured" },
      { status: 500 }
    );
  }

  let body: RunSimulationBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { boardId, mode, steps } = body;

  if (!boardId || !mode || !Number.isFinite(steps)) {
    return Response.json(
      { error: "boardId, mode and steps are required" },
      { status: 400 }
    );
  }

  if (!isSimulationMode(mode)) {
    return Response.json({ error: "Unsupported simulation mode" }, { status: 400 });
  }

  if (steps <= 0) {
    return Response.json({ error: "steps must be greater than 0" }, { status: 400 });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    return Response.json(
      { error: "NEXT_PUBLIC_CONVEX_URL is not configured" },
      { status: 500 }
    );
  }

  const convex = new ConvexHttpClient(convexUrl);

  let boardState;

  try {
    boardState = await convex.query(api.board.loadBoardState, {
      boardId: boardId as Id<"boards">,
    });
  } catch (error) {
    console.error("Failed to load board state from Convex:", error);
    return Response.json(
      { error: "Failed to load latest board history from Convex" },
      { status: 502 }
    );
  }

  const schema = buildBoardExportPayload({
    nodes: boardState.nodes,
    edges: boardState.edges,
    description: boardState.description,
    edgesType: boardState.edgesType,
  });

  const payload = {
    mode,
    params: {
      steps, 
      gamesCount: steps, 
    },
    nodes: boardState.nodes,
    edges: boardState.edges,
  };

  const simulationPath =
    process.env.JAVA_SIMULATION_PATH ?? "/api/simulation/run";
  const targetUrl = new URL(simulationPath, javaServiceUrl).toString();

  try {
    const javaResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.JAVA_API_KEY
          ? { Authorization: `Bearer ${process.env.JAVA_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    const responseText = await javaResponse.text();
    let responseBody: unknown = responseText;

    try {
      responseBody = responseText ? JSON.parse(responseText) : null;
    } catch {
      // keep plain text response
    }

    if (!javaResponse.ok) {
      return Response.json(
        {
          error: "Java service returned an error",
          details: responseBody,
        },
        { status: javaResponse.status }
      );
    }

    return Response.json({
      ok: true,
      boardVersion: boardState.version,
      result: responseBody,
    });
  } catch (error) {
    console.error("Failed to call Java service:", error);
    return Response.json(
      { error: "Failed to reach Java service" },
      { status: 502 }
    );
  }
}
