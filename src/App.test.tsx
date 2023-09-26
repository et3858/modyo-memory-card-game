import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from '@testing-library/react';
import App from "./App";


describe("App", () => {
    beforeEach(() => {
        render(<App />);
    });

    test("Should it show the title of the app once", () => {
        expect(screen.getByText("Play the Flip card game")).toBeDefined();
    });
});
