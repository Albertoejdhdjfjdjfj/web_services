import { SET_SEARCH } from '../../actions/state_components/actionsTypes';
import { StateComponents, Action } from '../../../assets/interfaces/reduxInterfaces';

const initialState: StateComponents = {
  search: ''
};

export default function state_components(
  state: StateComponents = initialState,
  action: Action
): StateComponents {
  switch (action.type) {
    case SET_SEARCH:
      return { ...state, search: action.payload as string };
    default:
      return state;
  }
}
