import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageLoader } from "./PageLoader";

describe("PageLoader", () => {
  it("exposes a labelled status while loading", () => {
    render(<PageLoader label="Loading vehicles" />);

    expect(
      screen.getByRole("status", { name: "Loading vehicles" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
