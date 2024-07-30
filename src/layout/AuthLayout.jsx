import { Outlet, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';


const AuthLayout = () => {
    const { authorize } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authorize()) {
            navigate('/dashboard');
        }
    }, []);

    return (
        <Outlet />
    );
}

export default AuthLayout;
