import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const userDescriptionSlice = createSlice({
  name: 'userDescription',
  initialState,
  reducers: {
    open: (state, action) => {
      return action.payload;
    },
  },
});

export default userDescriptionSlice.reducer;
