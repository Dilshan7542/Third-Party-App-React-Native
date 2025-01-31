import apiClient, {AppResponse} from "@/service/api-client";
export interface ReadyToCheckout{
  "fromAccountList":string[],
  "toAccount": string,
  "toAccountName": string
}

export const readyToCheckoutApi=async (nic:string)=>{
  const response = await apiClient.post<AppResponse<ReadyToCheckout>>("/third-party/user/account-details",{nic:nic});
  console.log(response);
  return response.data;
}
