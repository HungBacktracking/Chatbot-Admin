import React, { useEffect, useState } from 'react';
import classes from './DashBoard.module.css';
import axios from 'axios';  
import http from '../../services/http_common';
import { redirectToLogin } from '../../services/Cookie';
import WaitRoom from '../../components/WaitRoom/WaitRoom';
import ChatRoom from '../../components/ChatRoom/ChatRoom';

const fetchStats = async () => {
    try {
        const response = await http.get('/admin/read/stats');
        const stats = response.data;

        if (stats.error === true && stats.errortype === 'auth') {
            redirectToLogin();
            return;
        }

        if (stats.success === true) {
            return {
                cpu: stats.cpu,
                memory: stats.mem,
                uptime: stats.uptime,
            };
        } else {
            throw new Error('Unknown error');
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
};


const DashBoard = () => {
    const [stats, setStats] = useState({ cpu: '', memory: '', uptime: '' });

    useEffect(() => {
        const getStats = async () => {
            const fetchedStats = await fetchStats();
            if (fetchedStats) {
                setStats(fetchedStats);
            }
        };

        getStats();
        const intervalId = setInterval(getStats, 5000); // Fetch stats every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <div className='custom_container'>
            <h2 className={classes.title}>Thông tin</h2>
            {stats.cpu ? (
                <p className={classes.system}>CPU: {stats.cpu} | Memory: {stats.memory} | Uptime: {stats.uptime}</p>
            ) : (
                <p  className={classes.system}>Could not get stats of system: Unknown error</p>
            )}

            <WaitRoom></WaitRoom>
            <ChatRoom></ChatRoom>
        
        </div>
    );
};

export default DashBoard;