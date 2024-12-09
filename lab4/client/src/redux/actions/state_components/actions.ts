import { SET_SEARCH,SET_EMAIL} from './actionsTypes';
import { createAction } from 'redux-actions';

export const set_search = createAction(SET_SEARCH);
export const set_email = createAction(SET_EMAIL);