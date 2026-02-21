import { afterEach } from "vitest";
import { restoreAllMocks } from "./mock";

afterEach(() => {
  restoreAllMocks();
});
