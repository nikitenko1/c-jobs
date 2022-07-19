import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataAPI, patchDataAPI } from './../../utils/fetchData';

export const getApplicants = createAsyncThunk(
  'applicant/get', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const res = await getDataAPI(`job/applicant/${data.jobId}`, data.token);

      // API return res.status(200).json({ applicants });
      return res.data.applicants;
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const changeApplicantStatus = createAsyncThunk(
  'applicant/changeStatus',
  async (data, thunkAPI) => {
    // thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
    // as well as additional options:
    // dispatch: the Redux store dispatch method
    // getState: the Redux store getState method
    // ...
    try {
      const state = thunkAPI.getState().applicant;
      await patchDataAPI(
        `jobs-applied/status/${data.jobseeker}`,
        { job: data.jobId, status: data.status },
        data.token
      );

      return state.map((item) =>
        item.job === data.jobId && item.jobseeker._id === data.jobseeker
          ? { ...item, status: data.status }
          : item
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

const applicantSlice = createSlice({
  name: 'applicant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('applicant/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default applicantSlice.reducer;
