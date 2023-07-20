import Swal from "sweetalert2";
import api from "./api";
import TokenService from "./token.service";
import mainStyle from "../styles/mainStyle";

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
      
    }).catch(err => {
      
      // return Swal.fire({
      //   title: 'แจ้งเตือน',
      //   text: err.response.data.message,
      //   icon: 'error',
      //   showCancelButton: false,
      //   confirmButtonColor: mainStyle.dangerColor,
      //   cancelButtonColor: mainStyle.primaryColor,
      //   confirmButtonText: 'ปิด',
      //   //cancelButtonText: 'ปิด'
      // }).then(async (result) => {
      // })

      return {message: err.response.data.message};
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