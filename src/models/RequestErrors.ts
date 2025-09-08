export type ErrorResponseData = {
  type?: string;
  title?: string;
  status?: number;
  errors?: { [key: string]: string[] };
  authentication?: string[];
};

export type ErrorResponse = {
  code: "error";
  error: ErrorResponseData;
};
