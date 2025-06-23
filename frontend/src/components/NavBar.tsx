import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

const NavBar = () => {
    return (
        <div className="flex justify-between shadow-md px-10 py-4">
            <Link to={"/blogs"} className="flex flex-col justify-center font-bold text-3xl cursor-pointer">
                Blogbox
            </Link>
            <div>
                <Link to={"/publish"}>
                    <button type="button" className="mr-4 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Publish</button>
                </Link>
                <Avatar name="Anuj Bajpai" size="big" />
            </div>
        </div>
    )
}

export default NavBar