import Head from 'next/head';
import axios from 'axios';
import Navbar from '../components/global/Navbar';
import Footer from '../components/global/Footer';
import Jumbotron from '../components/home/Jumbotron';
import CategoryContainer from '../components/home/category/CategoryContainer';

const Home = ({ latestJobs, categories }) => {
  return (
    <>
      <Head>
        <title>Let&apos;s work | Home</title>
      </Head>
      <Navbar />
      <div>
        <Jumbotron />
        <CategoryContainer categories={categories} />
      </div>
      <Footer />
    </>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const res = await axios.get(`${process.env.CLIENT_URL}/api/home`);

  return {
    props: {
      latestJobs: res.data.latestJob,
      categories: res.data.categoryDisplay,
    },
  };
};
