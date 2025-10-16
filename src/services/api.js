import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
    //baseURL: 'http://api.malcolmdesmonte.com.br/'
    //baseURL: 'http://localhost:3333/'
    baseURL: 'http://192.168.1.4:3333'
});

api.interceptors.request.use(
    config => {
        config.headers.authorization = `Bearer ${getToken()}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
export default api;