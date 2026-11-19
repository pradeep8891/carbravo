import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders an alert with a retry action", () => {
    const onRetry = vi.fn();

    render(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render a retry action when one is not supplied", () => {
    render(<ErrorState />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
