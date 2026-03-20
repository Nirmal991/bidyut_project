import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { getCurrentUser } from './api/auth.api';
import './App.css';
import { setAuthLoad, setUser, logout } from './store/slices/AuthSlice';
import type { RootState } from './store/store';
import { useDispatch, useSelector } from "react-redux";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(setAuthLoad());
        return;
      }

      try {
        const response = await getCurrentUser();
        dispatch(setUser(response.data.data)); 
      } catch (error) {
        console.error(error);
        dispatch(logout()); 
      } finally {
        dispatch(setAuthLoad());
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <div className='min-h-screen bg-[#000000] w-full overflow-x-hidden'>
      <Routes>
        <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
      </Routes>
    </div>
  );
}

export default App;