import Head from 'next/head';
import Navbar from '../components/global/Navbar';
import Footer from '../components/global/Footer';
import Jumbotron from '../components/home/Jumbotron';

const Home = () => {
  return (
    <>
      <Head>
        <title>Let&apos;s work | Home</title>
      </Head>
      <Navbar />
      <div>
        <Jumbotron />
      </div>
      <Footer />
    </>
  );
};

export default Home;
