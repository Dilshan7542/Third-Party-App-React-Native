import axios, {CanceledError} from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: " https://epictechdev.com:50422/api",
});

export interface AppResponse<T> {
  status: string;
  content: T,
  message: string
}

apiClient.interceptors.request.use(async function (request) {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    request.headers['Authorization'] = `Bearer ` + token;
    request.headers['x-instance-id'] = "BBS6CD15-58D4-4FAC-9E6C-5AE9FB4FF535";
  }
  return request;
}, function (error) {
  return Promise.reject(error);
});
export default apiClient;
export {CanceledError};
