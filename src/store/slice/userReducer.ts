import { User } from '../../interface/user.ts';
import { RootState } from '../store.ts';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
 


export type TUserSlice = {
  value: User | null;
};

// Initial state
const initialState: TUserSlice = {
  value: null,
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user data
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    // Action to clear user data
    clearUser: (state) => {
      state.value = null;
    },

  },
});

// Selector to get the user from the Redux state
export const selectUser = (state: RootState): User | null => state.user.value;

// Export actions and reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
