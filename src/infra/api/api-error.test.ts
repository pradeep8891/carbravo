import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError, AxiosHeaders, CanceledError } from "axios";
import { describe, expect, it } from "vitest";

import { ApiError, normalizeApiError } from "./api-error";

function createAxiosError(
  status: number,
  data: unknown,
  headers: Record<string, string> = {},
): AxiosError {
  const config = {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig;

  const response = {
    data,
    status,
    statusText: "",
    headers: new AxiosHeaders(headers),
    config,
  } as AxiosResponse;

  return new AxiosError(
    "Request failed",
    undefined,
    config,
    undefined,
    response,
  );
}

describe("normalizeApiError", () => {
  describe("HTTP errors", () => {
    it.each([400, 401, 403, 404, 409, 500])(
      "normalizes HTTP %i errors",
      (status) => {
        const result = normalizeApiError(createAxiosError(status, {}));

        expect(result).toBeInstanceOf(ApiError);
        expect(result.type).toBe("http");
        expect(result.status).toBe(status);
      },
    );

    it("uses Spring ProblemDetail detail as the message", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          type: "about:blank",
          title: "Bad Request",
          status: 400,
          detail: "Invalid customer information",
        }),
      );

      expect(result.message).toBe("Invalid customer information");
    });

    it("uses the server message when detail is unavailable", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          message: "Invalid request",
        }),
      );

      expect(result.message).toBe("Invalid request");
    });

    it("extracts the server error code", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          code: "VALIDATION_ERROR",
        }),
      );

      expect(result.code).toBe("VALIDATION_ERROR");
    });

    it("extracts the request correlation ID", () => {
      const result = normalizeApiError(
        createAxiosError(500, {}, { "x-request-id": "request-123" }),
      );

      expect(result.requestId).toBe("request-123");
    });
  });

  describe("validation errors", () => {
    it("extracts Spring validation errors", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          errors: [
            {
              field: "email",
              defaultMessage: "Email is invalid",
            },
            {
              field: "name",
              defaultMessage: "Name is required",
            },
          ],
        }),
      );

      expect(result.fieldErrors).toEqual({
        email: "Email is invalid",
        name: "Name is required",
      });
    });

    it("extracts validation errors from an object", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          errors: {
            email: "Email is invalid",
            name: "Name is required",
          },
        }),
      );

      expect(result.fieldErrors).toEqual({
        email: "Email is invalid",
        name: "Name is required",
      });
    });

    it("extracts validation violations", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          violations: [
            {
              propertyPath: "email",
              message: "Invalid email",
            },
          ],
        }),
      );

      expect(result.fieldErrors).toEqual({
        email: "Invalid email",
      });
    });

    it("keeps the first error for duplicate fields", () => {
      const result = normalizeApiError(
        createAxiosError(400, {
          errors: [
            {
              field: "email",
              defaultMessage: "Email is required",
            },
            {
              field: "email",
              defaultMessage: "Email is invalid",
            },
          ],
        }),
      );

      expect(result.fieldErrors).toEqual({
        email: "Email is required",
      });
    });
  });

  describe("network errors", () => {
    it("normalizes network errors", () => {
      const error = new AxiosError("Network Error", "ERR_NETWORK");

      const result = normalizeApiError(error);

      expect(result.type).toBe("network");
      expect(result.retryable).toBe(true);
    });

    it("normalizes timeout errors", () => {
      const error = new AxiosError("timeout", "ECONNABORTED");

      const result = normalizeApiError(error);

      expect(result.type).toBe("timeout");
      expect(result.retryable).toBe(true);
    });
  });

  describe("cancellation", () => {
    it("normalizes canceled requests", () => {
      const result = normalizeApiError(new CanceledError());

      expect(result.type).toBe("canceled");
      expect(result.retryable).toBe(false);
    });
  });

  describe("unknown errors", () => {
    it("normalizes JavaScript errors", () => {
      const result = normalizeApiError(new Error("Unexpected error"));

      expect(result.type).toBe("unknown");
      expect(result.message).toBe("Unexpected error");
    });

    it("handles null safely", () => {
      const result = normalizeApiError(null);

      expect(result.type).toBe("unknown");
      expect(result).toBeInstanceOf(ApiError);
    });
  });
});
