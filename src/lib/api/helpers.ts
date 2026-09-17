import type { ApiResponse } from "@/types";
import { MOCK_LATENCY_MS, SIMULATE_ERROR_QUERY_KEY } from "@/lib/constants";

export class MockApiError extends Error {
  code: "not_found" | "simulated_failure" | "invalid_input";

  constructor(message: string, code: MockApiError["code"] = "simulated_failure") {
    super(message);
    this.name = "MockApiError";
    this.code = code;
  }
}

function randomLatency(): number {
  const { min, max } = MOCK_LATENCY_MS;
  return Math.round(min + Math.random() * (max - min));
}

/**
 * Development-only error simulation: append `?mockError=1` to the page URL
 * (client-side only) to force every subsequent mock service call to reject,
 * so loading/empty/error UI states are easy to exercise without a real backend.
 */
function shouldSimulateError(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get(SIMULATE_ERROR_QUERY_KEY) === "1";
}

export async function simulateNetwork<T>(
  resolve: () => T,
  options?: { errorMessage?: string },
): Promise<T> {
  await new Promise((res) => setTimeout(res, randomLatency()));

  if (shouldSimulateError()) {
    throw new MockApiError(
      options?.errorMessage ??
        "Simulated network failure — this is a development-only error state.",
    );
  }

  return resolve();
}

export function withEnvelope<T>(data: T, sourceLabel: string): ApiResponse<T> {
  return {
    data,
    meta: {
      sourceLabel,
      generatedAt: new Date().toISOString(),
      isMock: true,
    },
  };
}
