import { createGlobalState } from 'react-hooks-global-state';
import { cartType , userType, drinksType} from './types';

const initialState =  { cart: <cartType[]>[], user: <userType | undefined>undefined, drinks: <drinksType[] | undefined>undefined};
export const { useGlobalState } = createGlobalState(initialState);