/**
 * For a detailed explanation regarding each configuration property, visit:
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
};

export default config;
