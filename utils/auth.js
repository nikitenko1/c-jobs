import { uploadFile } from './uploadHelper';
import { postDataAPI } from './fetchData';

export const register = async (userData, avatar, dispatch) => {
  try {
    dispatch({
      type: 'alert/alert',
      payload: {
        loading: true,
      },
    });

    let data = { ...userData };

    if (userData.role === 'organization') {
      const imgUrl = await uploadFile(avatar, 'avatar');
      data.avatar = imgUrl[0];
    }

    const res = await postDataAPI('auth/register', data);
    dispatch({
      type: 'alert/alert',
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: 'alert/alert',
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};
