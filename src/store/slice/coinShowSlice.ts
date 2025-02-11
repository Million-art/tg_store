import { RootState } from '../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TCoinShowSlice = {
    value:  boolean;  
};

const initialState: TCoinShowSlice = {
    value: false,
};

const coinShowSlice = createSlice({
  name: 'coinShow',
  initialState,
  reducers: {
    setCoinShow: (state, action: PayloadAction<boolean>) => {  
      state.value = action.payload;
    },
  },
});

export const selectCoinShow = (state: RootState) => state.coinShow;
export const { setCoinShow } = coinShowSlice.actions;
export default coinShowSlice.reducer;
