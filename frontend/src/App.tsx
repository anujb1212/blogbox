import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Blog from './pages/Blog';
import Blogs from './pages/Blogs';
import Publish from './pages/Publish';
import EditBlog from './pages/EditBlog';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import MyBlogs from './pages/MyBlogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path='/publish' element={<Publish />} />
        <Route path='/edit/:id' element={<EditBlog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
