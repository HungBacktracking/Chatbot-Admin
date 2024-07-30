import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import classes from './SideBar.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import { redirectToLogin } from '../../services/Cookie';


const SideBar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        redirectToLogin();
    }

    return (
        <>
            <div className={classes.sidebar}>
                <div className={classes.brand}>
                    <div className={classes.name}>US Siri</div>
                    <div className={classes.green_dot}></div>
                </div>
                <div className={classes.description}>Modern Chatbot Dashboard</div>

                <div className={classes.navigator_list}>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/dashboard">
                        <i className="bi bi-house-check"></i>
                        <div className={classes.nav_text}>Tổng quan</div>
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/university">
                        <i className="fa-solid fa-school"></i>
                        <div className={classes.nav_text}>Khoa học tự nhiên</div>
                    </NavLink>
                    <NavLink className={({ isActive }) => isActive ? `${classes.nav_link} ${classes.active}` : classes.nav_link} to="/monitor">
                        <i className="bi bi-gear-wide-connected"></i>
                        <div className={classes.nav_text}>Điều khiển</div>
                    </NavLink>
                    <div className={classes.separate_wrapper}>
                        <div className={classes.separate}></div>
                    </div>
                    <div className={classes.nav_link} onClick={handleLogout}>
                        <i className="bi bi-box-arrow-left"></i>
                        <div className={classes.nav_text}>Đăng xuất</div>
                    </div>
                </div>

                <div className={classes.license}>
                    <div className={classes.license_app}>HCMUS Explorer Admin Dashboard</div>
                    <div className={classes.license_text}>© 2024 All rights reserved</div>
                    <div className={classes.author}>Made with love by Hưng Backtracking</div>
                </div>
            </div>
        </>
    );
}

export default SideBar;