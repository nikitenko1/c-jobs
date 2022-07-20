import React from 'react';
import Head from 'next/head';

const JobDetail = ({ job }) => {
  return (
    <>
      <Head>
        <title>
          Let&apos;s work | {job.position} at {job.organization?.user.name}
        </title>
      </Head>
    </>
  );
};

export default JobDetail;
