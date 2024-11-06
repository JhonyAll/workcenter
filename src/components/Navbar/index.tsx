import Link from 'next/link';
import logo from '@/assets/img/logo.svg'
import Image from 'next/image';
import { HiMiniBars3 } from "react-icons/hi2";
import { VscAccount } from "react-icons/vsc";

const Navbar: React.FC = () => {
  return (
    <nav className="text-white flex items-center justify-between py-4 px-6">
      <div className="flex items-center space-x-4">
        <button className="text-xl"><HiMiniBars3 size={28} /></button>
        <Link href="/" className="text-2xl font-bold">
          <Image src={logo} alt='' width={200} />
        </Link>
      </div>
      <div className='w-2/5 flex justify-center items-center'>
        <input
          type="text"
          placeholder="Pesquisar"
          className="bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none w-3/5 focus:w-full transition-all duration-300 focus:bg-transparent focus:border-solid border-solid focus:border border focus:border-slate-200 border-transparent"
        />
      </div>
      <div className="flex items-center space-x-4">
        <VscAccount size={24}/>
      </div>
    </nav>
  );
};

export default Navbar;