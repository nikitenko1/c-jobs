import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';

const ActivateAccount = ({ success, error }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (success) {
      dispatch({
        type: 'alert/alert',
        payload: { success: success },
      });
    } else if (error) {
      dispatch({
        type: 'alert/alert',
        payload: { error: error },
      });
    }

    router.push('/login');
  }, [dispatch, router, error, success]);

  return <></>;
};

export default ActivateAccount;

export const getServerSideProps = async (context) => {
  try {
    const res = await axios.post(
      `${process.env.CLIENT_URL}/api/auth/activate`,
      {
        token: context.query.id,
      }
    );

    const msg = res.data.msg;

    return {
      props: {
        success: msg,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err.response.data.msg,
      },
    };
  }
};
