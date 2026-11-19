import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("forwards click interactions", () => {
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save changes</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables itself and shows progress while loading", () => {
    render(<Button loading>Saving</Button>);

    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
