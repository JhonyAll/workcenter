import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <button className="text-xl">☰</button>
        <Link href="/" className="text-2xl font-bold">
          Rocketseat
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Busque por assuntos e aulas"
          className="bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none"
        />
        <button className="bg-purple-600 px-4 py-2 rounded-lg">Comece grátis</button>
      </div>
    </nav>
  );
};

export default Navbar;