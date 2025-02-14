import apiClient, {AppResponse} from "@/service/api-client";

export interface ReadyToCheckout {
  "fromAccountList": string[],
  "toAccount": string,
  "toAccountName": string
}

export interface ProcessPaymentReq {
  'nic': string,
  'amount': number,
  'transactionRef': string,
}

export const readyToCheckoutApi = async (nic: string) => {
  const response = await apiClient.post<AppResponse<ReadyToCheckout>>("/third-party/user/account-details", {nic: nic});
  console.log(response);
  return response.data;
}
export const processPaymentApi = async (req: ProcessPaymentReq) => {
  console.log("Request Payment ", req)
  const response = await apiClient.post<AppResponse<{ webUrl: string }>>("/third-party/user/pay-lottery", req);
  console.log("Response Process Payment ", response.data);
  return response.data;
}
