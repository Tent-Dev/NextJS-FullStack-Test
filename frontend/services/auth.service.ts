import api from "./api";
import TokenService from "./token.service";

// const register = (username, email, password) => {
//   return api.post("/auth/signup", {
//     username,
//     email,
//     password
//   });
// };

const userLogin = (email: string, password: string) => {
  return api
    .post("/user/login", {
      email,
      password
    })
    .then((response) => {
      if (response.data.token) {
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

// const logout = () => {
//   TokenService.removeUser();
// };

// const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem("user"));
// };

const AuthService = {
//   register,
userLogin,
//   logout,
//   getCurrentUser,
};

export default AuthService;