import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import createFetchMock from 'vitest-fetch-mock';
import { vi } from "vitest";
import '@testing-library/jest-dom/vitest';


// Mocking fetch (The 'fetch' API is unavailable in NodeJS v16.x and lower)
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks(); // sets globalThis.fetch and globalThis.fetchMock to our mocked version


// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
