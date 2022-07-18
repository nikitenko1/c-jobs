import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from '../../utils/fetchData';
import { uploadFile } from '../../utils/uploadHelper';

// thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
// as well as additional options:
// dispatch: the Redux store dispatch method
// getState: the Redux store getState method
// ...

export const getCategory = createAsyncThunk(
  'category/get', // redux action type constants
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { loading: true },
      });

      const res = await getDataAPI(
        `category/admin?page=${data.page}`,
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });
      // API  return res.status(200).json({ categories, totalPage });
      return {
        data: res.data.categories,
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

export const createCategory = createAsyncThunk(
  'category/create', // redux action type constants
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState().category;
      let imgUrl = await uploadFile(data.image, 'category');

      const res = await postDataAPI(
        'category',
        { ...data, image: imgUrl[0] },
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
      //  API: return res.status(200).json({
      //     msg: `${name} category has been created successfully.`,
      //     category: newCategory,
      //   });
      return {
        ...state,
        data: [res.data.category, ...state.data],
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

export const updateCategory = createAsyncThunk(
  'category/update', // redux action type constants
  async (data, thunkAPI) => {
    // thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
    // as well as additional options:
    // dispatch: the Redux store dispatch method
    // getState: the Redux store getState method
    // ...
    try {
      const state = thunkAPI.getState().category;

      let newImgUrl;

      if (typeof data.image !== 'string') {
        if (data.image.length > 0) {
          newImgUrl = await uploadFile(data.image, 'category');
        }
      }

      const res = await patchDataAPI(
        `category/${data._id}`,
        { ...data, image: newImgUrl ? newImgUrl[0] : data.prevImg },
        data.token
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
      //   API return res.status(200).json({
      //     msg: 'Category has been updated successfully.',
      //     category: updatedCategory,
      //   });

      return {
        ...state,
        data: state.data.map((item) =>
          item._id === res.data.category._id ? res.data.category : item
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

export const deleteCategory = createAsyncThunk(
  'category/delete', // redux action type constants
  async (data, thunkAPI) => {
    // thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function
    // as well as additional options:
    // dispatch: the Redux store dispatch method
    // getState: the Redux store getState method
    // ...

    try {
      const state = thunkAPI.getState().category;

      const res = await deleteDataAPI(`category/${data.id}`, data.token);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
      //   return res
      //   .status(200)
      //   .json({ msg: 'Category has been deleted successfully.' });
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

const category = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('category/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default category.reducer;
