import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
} from './../../utils/fetchData';

// thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
// as well as additional options:
// dispatch: the Redux store dispatch method
// getState: the Redux store getState method
// ...

export const getUnapprovedOrganizations = createAsyncThunk(
  'organization/getUnapproved', // redux action type constants
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { loading: true },
      });

      const res = await getDataAPI(
        `organization/unapproved?page=${data.page}`,
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });
      // API return .json({ organizations: unapprovedOrganization, totalPage });)
      return {
        data: res.data.organizations,
        totalPage: res.data.totalPage,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const acceptOrganization = createAsyncThunk(
  'organization/accept', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().organization;

      const res = await patchDataAPI(
        `organization/accept/${data.id}`,
        {},
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      // API return json({msg: `Organization with ID ${req.query.id} has been accepted successfully.`
      return {
        ...state,
        data: state.data.filter((item) => item._id !== data.id),
      };
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

export const rejectOrganization = createAsyncThunk(
  'organization/reject', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().organization;

      const res = await deleteDataAPI(
        `organization/reject/${data.id}`,
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      // API return json({msg: `Organization with ID ${req.query.id} has been rejected successfully.`,
      return {
        ...state,
        data: state.data.filter((item) => item._id !== data.id),
      };
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

const initialState = { data: [], totalPage: 0 };

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('organization/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default organizationSlice.reducer;
