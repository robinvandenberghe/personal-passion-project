import { createGlobalState } from 'react-hooks-global-state';
import { cartType , userType} from './types';

const initialState =  { cart: <cartType[]>[], user: <userType | undefined>undefined};
export const { useGlobalState } = createGlobalState(initialState);