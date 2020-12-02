import { createGlobalState } from 'react-hooks-global-state';
import { cartType } from './types';
const initialState = { cart: [ ]};
export const { useGlobalState } = createGlobalState(initialState);