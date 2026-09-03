// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./BookingAssistant", () => ({
  default: ({ open, requestText }: { open: boolean; requestText: string }) => (
    <output data-testid="booking-assistant" data-open={String(open)}>{requestText}</output>
  ),
}));

import InteriorPainting from "./InteriorPainting";

describe("Interior Painting landing page", () => {
  it("opens the shared booking flow with an Interior Painting request from the Accent wall CTA", () => {
    render(<InteriorPainting />);

    fireEvent.click(screen.getByRole("button", { name: /^Accent wall$/ }));

    const bookingAssistant = screen.getByTestId("booking-assistant");
    expect(bookingAssistant.getAttribute("data-open")).toBe("true");
    expect(bookingAssistant.textContent).toContain("I need an accent wall painted.");
  });
});
