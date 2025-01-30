import apiClient, {AppResponse} from "@/service/api-client";

export interface IUser {
  id: string,
  name:string,
  nic: string
}
export interface LoginResp{
 access_token: string,
  name:string,
  nic:string
}
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get<AppResponse<IUser[]>>("/third-party/user");
    console.log(response)
    return response.data;
  } catch (e: any) {
    console.log(e);
    throw e.message;
  }
}
export const startSession=async (nic:string,pushId:string)=>{
  const response = await apiClient.post<AppResponse<{ url: string }>>("/third-party/user/check-user",{nicNumber:nic,pushId:pushId});
  console.log(response);
  return response.data;
}
export const userLogin=async (login:{
  "nic": string,
  "password": string
})=>{
  const response = await apiClient.post<AppResponse<LoginResp>>("/third-party/user/login",login);
return response.data
}
