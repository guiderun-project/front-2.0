export type FieldErrorType = {
  field: string;
  message: string;
};

export type ErrorType = {
  errorCode: string;
  message: string;
  status?: number;
  path?: string;
  timestamp?: string;
  fieldErrors?: FieldErrorType[];
};
