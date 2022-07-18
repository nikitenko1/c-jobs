import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { BsPower } from 'react-icons/bs';
import { logout } from './../../redux/slices/authSlice';
import Image from 'next/image';
import Logo from './../../public/images/logo.png';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleLogout = () => {
    router.push('/login');
    dispatch(logout());
  };
  return (
    <div className="sticky top-0 z-[99] shadow-md flex items-center justify-between gap-6 py-7 px-14">
      <div
        onClick={() => router.push('/')}
        className="flex items-center cursor-pointer"
      >
        <Image src={Logo} width={60} height={60} alt="Let's work" />
        <h1 className="text-xl">Let&apos;s work | Back Home</h1>
      </div>
      <div>
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 rounded-full outline-2 outline-offset-2 outline-gray-700 outline shrink-0">
            <img
              src={auth.user?.avatar}
              alt={auth.user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <p className="text-sm">{auth.user?.name}</p>
          <BsPower onClick={handleLogout} className="cursor-pointer text-xl" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
