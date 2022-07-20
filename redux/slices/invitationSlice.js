import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataAPI, patchDataAPI, postDataAPI } from './../../utils/fetchData';

// thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
// as well as additional options:
// dispatch: the Redux store dispatch method
// getState: the Redux store getState method
// ...
export const sendInvitation = createAsyncThunk(
  'invitation/send', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().invitation;
      const res = await postDataAPI(
        'invitation',
        { jobId: data.jobId, userId: data.userId },
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
      // API return res.status(200).json({ invitation })
      return [res.data.invitation, ...state];
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  }
);

export const getReceivedInvitations = createAsyncThunk(
  'invitation/get',
  async (token, thunkAPI) => {
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true,
        },
      });

      const res = await getDataAPI('invitation', token);

      return res.data.invitations;
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  }
);

export const changeInvitationStatus = createAsyncThunk(
  'invitation/change',
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().invitation;

      const res = await patchDataAPI(
        `invitation/${data.id}`,
        { status: data.status },
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      return state.map((item) =>
        item._id === data.id ? { ...item, status: data.status } : item
      );
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  }
);

const initialState = [];

const invitationSlice = createSlice({
  name: 'invitation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('invitation/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default invitationSlice.reducer;
