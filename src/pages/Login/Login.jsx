import React, { useRef, useState, useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import classes from './Login.module.css';
import CryptoJS from 'crypto-js';
import http from '../../services/http_common';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import { setAppToken, redirectToLogin } from '../../services/Cookie';
import { delay } from '../../services/utils';


const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef(null);
    const formRef = useRef(null);
    const wrapperRef = useRef(null);

    

    const checkAuthorizeToken = (token) => {
        http({
            method: 'get',
            url: '/admin/auth',
            headers: { 'X-Auth-Token': token }
        })
        .then( async (res) => {
            if (res.data.success === true) {
                toast.success('Đăng nhập thành công!');
                await delay(1000);
                login(token);
                navigate('/dashboard');
            } else if (res.data.error === true && res.data.errortype === 'auth') {
                toast.error('Sai mật khẩu!');
                await delay(1000);
                redirectToLogin();
            } else {
                toast.error('Có lỗi xảy ra!');
                await delay(1000);
                redirectToLogin();
            }
        })
        .catch( async (err) => {
            toast.error('Lỗi kết nối!');
            await delay(1000);
            console.error(err);

            redirectToLogin();
        });
    }


    const handleLogin = (event) => {
        event.preventDefault();

        wrapperRef.current.classList.add('form-success');
        formRef.current.style.display = 'none';
        setLoading(true);

        const date = new Date();
        const time = date.getTime();
        const pwd = CryptoJS.SHA256(passwordRef.current.value).toString();
        let token = {
            time: time,
            hash: CryptoJS.SHA256(time + '' + pwd).toString()
        };
        token = CryptoJS.AES.encrypt(JSON.stringify(token), pwd).toString();

        setTimeout(() => checkAuthorizeToken(token), 500);
    };


    return (
        <div className={classes.wrapper} ref={wrapperRef}>
            <ToastContainer />
            <div className={classes.container}>
                <h1>HCMUSChat Admin</h1>
                {loading && <h1 id="loading" style={{ fontSize: '28px' }}>Please wait...</h1>}

                <form className={classes.form} ref={formRef} onSubmit={handleLogin}>
                    <input type="password" placeholder="Password" id="pwd" ref={passwordRef} />
                    <button type="submit" id="login-button">Login</button>
                </form>
            </div>

            <ul className={classes.bg_bubbles}>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
};

export default Login;
