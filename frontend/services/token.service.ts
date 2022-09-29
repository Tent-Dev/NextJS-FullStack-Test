import { store } from '../reducer/store'

// const dispatch = useDispatch();
// const router = useRouter();

const getLocalRefreshToken = () => {
    let user = JSON.parse(localStorage.getItem("persist:root"));
    console.log('-----getLocalRefreshToken-----')
    if(user){
        user.refreshToken = JSON.parse(user.refreshToken);
    }
    console.log(user.refreshToken);
    console.log('-----------------------------')
    return user?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    let user = store.getState();
    console.log('----getLocalAccessToken----')
    console.log(user.users.token);
    console.log('-----------------------------')
    return user?.users.token;
  };
  
  const updateLocalAccessToken = async (data: any) => {
    let user = JSON.parse(localStorage.getItem("persist:root"));
    if(user){
        console.log('USERRRRRRRRRRRRRRRR')
        user.token = data.token;
        user.refreshToken = data.refreshToken;
        user.user = data.user
    }
    console.log('----updateLocalAccessToken----');
    console.log(user);
    console.log('-----------------------------')
    // localStorage.setItem("persist:root", JSON.stringify(user));

    store.dispatch({
        type: 'LOGIN_SUCCESS',
        data: user
      });
  };
  
//   const getUser = () => {
//     return JSON.parse(localStorage.getItem("user"));
//   };
  
  const setUser = (response: any) => {
    console.log('------setUser-----');
    console.log(response);
    store.dispatch({
        type: 'LOGIN_SUCCESS',
        data: response
      });
  };
  
//   const removeUser = () => {
//     localStorage.removeItem("user");
//   };
  
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    // getUser,
    setUser,
    // removeUser,
  };
  
  export default TokenService;