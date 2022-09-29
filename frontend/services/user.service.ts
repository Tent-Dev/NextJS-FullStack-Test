import api from "./api";

const getParty = () => {
  return api.post("/party");
};

const getModeratorBoard = () => {
  return api.get("/test/mod");
};

const getAdminBoard = () => {
  return api.get("/test/admin");
};

const UserService = {
    getParty,
    getModeratorBoard,
    getAdminBoard,
};

export default UserService;