import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { logout } from './../../redux/slices/authSlice';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './../../public/images/logo.png';

const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { pathname } = useRouter();

  const sidebarRef = useRef();

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openSidebar &&
        /**
         * Alert if clicked on outside of element
         */
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpenSidebar(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openSidebar]);

  const handleLogout = () => {
    router.push('/login');
    dispatch(logout());
  };

  /* flex-1:  means the following 1 1 0%: 
  flex-grow : 1; ➜ The div will grow in same proportion as the window-size 
  flex-shrink : 1; ➜ The div will shrink in same proportion as the window-size
  flex-basis : 0; - if 3 divs are in the wrapper then each div will take 33%. */
  return (
    <div className="flex items-center justify-between gap-10 lg:px-16 pl-4 pr-7 py-3 bg-white sticky top-0 z-[999] shadow-sm">
      <div
        onClick={() => router.push('/')}
        className="flex items-center cursor-pointer"
      >
        <Image src={Logo} width={60} height={60} alt="Let's work" />
        <h1 className="text-xl">Let&apos;s work |</h1>
      </div>
      <div onClick={() => setOpenSidebar(true)} className="lg:hidden block">
        <GiHamburgerMenu className="text-xl cursor-pointer" />
      </div>
      <div
        ref={sidebarRef}
        className={`lg:static fixed top-0 ${
          openSidebar ? 'right-0' : '-right-[3000px]'
        } transition-all bottom-0 lg:shadow-none shadow-xl lg:w-auto w-[200px] lg:p-0 p-7 bg-white lg:flex lg:flex-1`}
      >
        <AiOutlineClose
          onClick={() => setOpenSidebar(false)}
          className="float-right text-xl mb-5 lg:hidden cursor-pointer"
        />
        <div className="clear-both" />
        <div className="flex-1 lg:flex-row flex-col flex lg:items-center items-start text-sm lg:gap-7 gap-4">
          <Link href="/">
            <a
              className={`navbar-link ${
                pathname === '/' || pathname === '/index' ? 'active' : undefined
              }`}
            >
              Home
            </a>
          </Link>
          <Link href="/jobs">
            <a
              className={`navbar-link ${
                pathname === '/jobs' ? 'active' : undefined
              }`}
            >
              Find Jobs
            </a>
          </Link>
          {(auth.user?.role === 'organization' ||
            auth.user?.role === 'admin') && (
            <Link href="/find_candidate">
              <a
                className={`navbar-link ${
                  pathname === '/find_candidate' ? 'active' : undefined
                }`}
              >
                Find Candidates
              </a>
            </Link>
          )}
        </div>
        <div className="text-sm flex lg:flex-row flex-col lg:items-center items-start lg:gap-8 gap-4 mt-10 lg:mt-0">
          {!auth.accessToken ? (
            <>
              <Link href="/login">
                <a
                  className={`navbar-link ${
                    pathname === '/login' ? 'active' : undefined
                  }`}
                >
                  Login
                </a>
              </Link>
              <Link href="/register">
                <a
                  className={`px-6 py-2 border-2 rounded-full border-blue-600  ${
                    pathname === '/register' ||
                    pathname === '/register/jobseeker' ||
                    pathname === '/register/organization'
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-600'
                  }`}
                >
                  Register Now
                </a>
              </Link>
            </>
          ) : (
            <>
              {auth.user?.role === 'jobseeker' ? (
                <>
                  <Link href="/edit_profile">
                    <a
                      className={`navbar-link ${
                        pathname === '/edit_profile' ? 'active' : undefined
                      }`}
                    >
                      Edit Profile
                    </a>
                  </Link>
                  <Link href="/received_invitation">
                    <a
                      className={`navbar-link ${
                        pathname === '/received_invitation'
                          ? 'active'
                          : undefined
                      }`}
                    >
                      Invitation
                    </a>
                  </Link>
                  <Link href="/job_applied">
                    <a
                      className={`navbar-link ${
                        pathname === '/job_applied' ? 'active' : undefined
                      }`}
                    >
                      Jobs Applied
                    </a>
                  </Link>
                </>
              ) : auth.user?.role === 'organization' ? (
                <>
                  <Link href="/organization/jobs">
                    <a
                      className={`navbar-link ${
                        pathname === '/organization/jobs' ? 'active' : undefined
                      }`}
                    >
                      Jobs Posted
                    </a>
                  </Link>
                  <Link href="/sent_invitation">
                    <a
                      className={`navbar-link ${
                        pathname === '/sent_invitation' ? 'active' : undefined
                      }`}
                    >
                      Sent Invitation
                    </a>
                  </Link>
                </>
              ) : (
                <Link href="/organization/approval">
                  <a className="navbar-link">Dashboard</a>
                </Link>
              )}
            </>
          )}
          <div onClick={handleLogout}>
            <p className="navbar-link cursor-pointer">Logout</p>
          </div>
          <div>
            <p>Hi, {auth.user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
