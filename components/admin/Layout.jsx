import Head from 'next/head';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ title, pageTitle, children }) => {
  return (
    <>
      <Head>
        <title>Let&apos;s work | {title}</title>
      </Head>
      <div className="flex h-screen">
        <Sidebar />
        {/* flex-basis: 4rem; /* 64px */}
        <div className="flex-[16]">
          <Navbar />
          <div className={`mt-20 px-10 ${!pageTitle ? 'mb-7' : undefined}`}>
            {pageTitle && (
              <h1 className="font-medium text-xl mb-7">{pageTitle}</h1>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
