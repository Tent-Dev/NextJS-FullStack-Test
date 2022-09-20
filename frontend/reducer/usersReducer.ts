import { legacy_createStore as createStore } from 'redux'

function userReducer(state = {}, action: {[key: string]: any}) {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return state = action.data
      case 'UPDATE_USER':
        return { ...state, party_joined: action.data }
      case 'REMOVE':
        return state
      default:
        return state
    }
}

let store = createStore(userReducer)

store.subscribe(() => console.log(store.getState()))

export default userReducer;