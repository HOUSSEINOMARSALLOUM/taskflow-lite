export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleError = (error: any) => {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: error.message,
        code: error.code,
      },
    };
  }

  console.error("Unexpected error:", error);
  return {
    statusCode: 500,
    body: {
      error: "Internal server error",
    },
  };
};
