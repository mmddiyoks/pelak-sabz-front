import { AxiosError, AxiosResponse } from "axios";
import { Logger } from "../logger";
import { Axios } from "./axios";
import { ErrorResponse, ErrorResponseData } from "@/models/RequestErrors";
const logger = Logger.get("HttpClients.ts");

type BaseRequest<T, V> = (params?: T) => Promise<AxiosResponse<V>>;

export type SuccessResponse<V> = {
  code: "success";
  data: V;
};

type BaseResponse<V> = SuccessResponse<V> | ErrorResponse;

export const requestHandler =
  <T, V>(request: BaseRequest<T, V>) =>
  async (params?: T): Promise<BaseResponse<V>> => {
    try {
      const response = await request(params);
      return { code: "success", data: response.data };
    } catch (e) {
      const error = e as AxiosError<unknown>;
      if (error.response?.status === 401) {
        try {
          await Axios.post("Account/refreshtoken");
          const retryResponse = await request(params);
          return { code: "success", data: retryResponse.data };
        } catch (authError: unknown) {
          logger.error("Re-authentication failed", authError);
          return {
            code: "error",
            error: { authentication: [String(authError)] },
          };
        }
      } else {
        const data = error.response?.data as ErrorResponseData | object;

        return { code: "error", error: data };
      }
    }
  };
