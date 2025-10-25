import axios from "axios";
import { getToken } from "./auth";

const baseURL = 'http://192.168.1.2:3333'

const api = axios.create({
    //baseURL: 'http://api.malcolmdesmonte.com.br/'
    //baseURL: 'http://localhost:3333/'
    baseURL
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
export { api, baseURL};