import { RootState } from '../store.ts';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
 
// Define user type
export type TUser = {
  uid: string;
  firstName: string;
  lastName: string;
  userImage: string | null;
  username?: string
  languageCode?:string,
  referrals?: string[],
  referredBy?: string | null,
  isPremium?: boolean

};

export type TUserSlice = {
  value: TUser | null;
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
    setUser: (state, action: PayloadAction<TUser>) => {
      state.value = action.payload;
    },
    // Action to clear user data
    clearUser: (state) => {
      state.value = null;
    },

  },
});

// Selector to get the user from the Redux state
export const selectUser = (state: RootState): TUser | null => state.user.value;

// Export actions and reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
