import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    transform: {
        "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
    },
    testMatch: [
        "<rootDir>/tests/unit/**/*.test.ts",
        "<rootDir>/tests/http/**/*.test.ts",
    ],
    setupFiles: ["<rootDir>/tests/setup.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.ts"],
    clearMocks: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/index.ts",
        "!src/migrations/**",
        "!src/scripts/**",
        "!src/**/*.d.ts",
    ],
};

export default config;