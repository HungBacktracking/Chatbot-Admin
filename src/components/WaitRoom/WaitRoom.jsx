import React, { useState, useEffect } from 'react';
import classes from './WaitRoom.module.css';
import http from '../../services/http_common';
import { redirectToLogin } from '../../services/Cookie';
import moment from '../../services/moment.locale.vi';


const fetchWaitRooms = async () => {
    try {
        const response = await http.get('/admin/read/waitroom');
        const data = response.data;
    
        if (data.error === true && data.errortype === 'auth') {
            redirectToLogin();
            return;
        }

        if (data.success === true) {
            return data.waitRoom;
        } else {
            throw new Error('Unknown error');
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
};

const fetchUserData = async (id) => {
    try {
        const response = await http.post('/admin/userinfo', { id });
        const data = response.data;

        if (data.error === true) {
            if (data.errortype === 'auth') {
                redirectToLogin();
            }
            return null;
        }

        return data.userProfile;
    } catch (error) {
        console.error(`Error fetching user data for ID ${id}:`, error);
        return null;
    }
};

const WaitRoom = () => {
    const [waitRoomList, setWaitroomList] = useState([]);
    const [summary, setSummary] = useState({men: 0, women: 0, unk: 0});

    useEffect(() => {
        const getWaitRooms = async () => {
            const data = await fetchWaitRooms();
            if (data) {
                console.log("Data: ", data);
                // Fetch user data for each wait room entry
                const waitRoomWithUserData = await Promise.all(data.map(async (entry) => {
                    const userProfile = await fetchUserData(entry.id);
                    if (userProfile === null) return null;

                    return { ...entry, userProfile };
                }));
                if (waitRoomWithUserData.includes(null)) return; // Error fetching user data

                waitRoomWithUserData.sort((a, b) => b.time - a.time);
                setWaitroomList(waitRoomWithUserData);

                // Calculate summary
                const summary = waitRoomWithUserData.reduce((acc, e) => {
                    if (e.userProfile.gender === 'female') acc.women++;
                    else if (e.userProfile.gender === 'male') acc.men++;
                    else acc.unk++;
                    return acc;
                }, { men: 0, women: 0, unk: 0 });

                setSummary(summary);
            }
        };

        getWaitRooms();
        const intervalId = setInterval(getWaitRooms, 10000); // Fetch stats every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <div className={classes.small_container}>
            <h3 className={classes.title}>Phòng chờ</h3>
            <div className={classes.description}>Danh sách phòng chờ hiện tại có ({waitRoomList.length} người: {summary.men} nam, {summary.women} nữ, {summary.unk} khác)</div>
            
            <div className={classes.waitroom_list}>
                {waitRoomList.map(waitroom => (
                    <div key={waitroom.id} className={classes.waitroom}>
                        <div className={classes.content}>
                            <img className={classes.waitroom_img} src={waitroom.userProfile.profile_pic} alt="Avatar người dùng" loading="lazy"/>
                            <div className={classes.waitroom_text}>
                                <div className={classes.waitroom_id}>ID: {waitroom.id}</div>
                                <div className={classes.waitroom_name}>{waitroom.userProfile.last_name} {waitroom.userProfile.first_name} { waitroom.userProfile.gender === 'male' ? '(Nam)' : waitroom.userProfile.gender === 'female' ? '(Nữ)' : '' }</div>
                            </div>
                        </div>
                        <div className={classes.time}>
                            <div className={classes.waitroom_time}>{moment(waitroom.time).format('llll')}</div>
                        </div>
                        <hr className={classes.separate}/>
                    </div>
                ))}
                <div className={classes.separate_mid}></div>
            </div>

        </div>
    );
}

export default WaitRoom;