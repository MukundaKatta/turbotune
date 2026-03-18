import { describe, it, expect } from "vitest";
import { Turbotune } from "../src/core.js";
describe("Turbotune", () => {
  it("init", () => { expect(new Turbotune().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Turbotune(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Turbotune(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
