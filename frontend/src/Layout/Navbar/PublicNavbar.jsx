import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="bg-[#1f3c88] px-12 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" className="border border-blue-300 rounded-full px-5 py-1
          text-2xl text-white hover:bg-blue-600 transition">
        PGRS
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-8 text-white text-lg">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>

        <Link
          to="/auth"
          className="border border-blue-300 rounded-full px-5 py-1
            text-white hover:bg-blue-600 transition"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
