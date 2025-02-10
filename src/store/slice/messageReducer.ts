import { RootState } from '../store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

 export type TMessage = {
  message: string; 
  color: string;  
};

export type TMessageSlice = {
  value: TMessage | null;  
};

// Initial state
const initialState: TMessageSlice = {
  value: null,
};

// Create the slice
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // Action to set the message to show or clear it (by passing null)
    setShowMessage: (state, action: PayloadAction<TMessage | null>) => {
      state.value = action.payload;
    },
    // Action to clear the message
    clearMessage: (state) => {
      state.value = null;
    },
  },
});

// Selector to get the message from the Redux state
export const selectShowMessage = (state: RootState): TMessage | null => state.message.value;

// Export actions and reducer
export const { setShowMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
