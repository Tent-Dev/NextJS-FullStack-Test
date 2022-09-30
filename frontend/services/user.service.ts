import api from "./api";

const getParty = () => {
  return api.post("/party");
};

const actionParty = (userId: number,partyId: number, actionType: string) => {
  let action = {};

  if(actionType === 'leave'){
    action.party_leave = partyId;
  }
  else if(actionType === 'join'){
    action.party_joined = partyId;
  }

  return api.patch(`/party/action/${userId}`,action);
};

const getAdminBoard = () => {
  return api.get("/test/admin");
};

const UserService = {
    getParty,
    actionParty,
    getAdminBoard,
};

export default UserService;