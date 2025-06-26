import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <nav className="w-full flex justify-between items-center px-6 py-4 shadow">
            {/* Left Side Logo and Navigation */}
            <div className="flex items-center space-x-6">
                <Link to="/blogs" className="text-xl font-semibold hover:text-gray-600">
                    BlogBox
                </Link>
                <Link
                    to="/publish"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Write
                </Link>
            </div>

            {/* Right Side Avatar */}
            <div className="relative">
                <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full bg-gray-400 cursor-pointer flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                >
                    {/* You can replace initials with avatar img if needed */}
                    U
                </div>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                        <Link
                            to="/blogs"
                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                        >
                            My Blogs
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;