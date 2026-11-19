import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusChip } from "./StatusChip";

describe("StatusChip", () => {
  it("renders its label", () => {
    render(<StatusChip label="Active" tone="success" />);

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("defaults to a neutral tone", () => {
    render(<StatusChip label="Draft" />);

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});
