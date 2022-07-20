import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from './../../utils/fetchData';

// thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
// as well as additional options:
// dispatch: the Redux store dispatch method
// getState: the Redux store getState method
// ...

export const getJobs = createAsyncThunk(
  'job/get', // redux action type constants
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { loading: true },
      });

      const res = await getDataAPI(`job?page=${data.page}`, data.token);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });
      // API return res.status(200).json({ jobs, totalPage })
      return {
        data: res.data.jobs,
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

export const createJob = createAsyncThunk(
  'job/create', // redux action type constants
  async (jobData, thunkAPI) => {
    try {
      const state = thunkAPI.getState().job;
      const res = await postDataAPI('job', jobData, jobData.token);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      // API return res.status(200).json({ job });
      return {
        ...state,
        data: [res.data.job, ...state.data],
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

export const deleteJob = createAsyncThunk(
  'job/delete', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().job;
      const res = await deleteDataAPI(`job/${data.id}`, data.token);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      // API .json({ msg: 'Job has been deleted successfully.' });
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

export const updateJob = createAsyncThunk(
  'job/update', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().job;
      const res = await patchDataAPI(`job/${data.id}`, data, data.token);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      // API  return res.status(200).json({
      //     msg: 'Job has been updated successfully.',
      //     job: updatedJob,
      //   });

      return {
        ...state,
        data: state.data.map((item) =>
          item._id === res.data.job._id ? res.data.job : item
        ),
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

export const getJobPosition = createAsyncThunk(
  'job/position', // redux action type constants
  async (token, thunkAPI) => {
    try {
      const res = await getDataAPI('job/position', token);
      return {
        data: res.data.position,
        page: 1,
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

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('job/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default jobSlice.reducer;
