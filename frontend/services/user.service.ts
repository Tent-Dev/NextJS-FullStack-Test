import api from "./api";

const getParty = (params : object) => {
  return api.post("/party", params);
};

const actionParty = (userId: number,partyId: number, actionType: string) => {
  type ActionObj = {
    party_joined?: Number;
    party_leave?: Number;
  };

  let action: ActionObj = {};

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