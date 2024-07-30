import { Outlet } from 'react-router-dom';
import SideBar from './SideBar/SideBar';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';


const MainLayout = () => {
    const navigate = useNavigate();
    const { authorize } = useContext(AuthContext);

    useEffect(() => {
        if (!authorize()) {
            navigate('/');
        }
    }, []);

    return (
        <>
            <SideBar />
            <Outlet />
        </>
    );
}

export default MainLayout;
