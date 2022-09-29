import axios from "axios";
import TokenService from "./token.service";
const instance = axios.create({
    baseURL: "http://localhost:3100/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();

      if (token) {
        config.headers["authorization"] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
        console.log('------res------');
        console.log(res.config.url);
        console.log(res);
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      console.log('----Error----')
      console.log(err);
    //   console.log(originalConfig)
      if (originalConfig.url !== "/user/login" || originalConfig.url !== "/nopermission" && err.response) {
        // Access Token was expired
        console.log('Access Token was expired');
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          console.log('Access Token was expired 222');
          try {
            const rs = await instance.post("/user/token", {
              refreshToken: TokenService.getLocalRefreshToken(),
            });
            console.log('------refreshToken data-----');
            console.log(rs.data);
            console.log('----------------------------');
            // const { token } = rs.data;
           await TokenService.updateLocalAccessToken(rs.data);
  
            return instance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }else{
            console.log('ERROR_OTHER: ', err.response.status);
            // instance.post("/nopermission");
            window.location.href = '/';
        }
      }
      return Promise.reject(err);
    }
  );
  
  export default instance;