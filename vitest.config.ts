import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.{ts,js}'],
            thresholds: {
                branches: 68,
                functions: 69,
                lines: 72,
                statements: 70,
            },
        },
    },
});

