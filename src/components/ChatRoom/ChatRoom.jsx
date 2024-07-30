import React, { useState, useEffect } from 'react';
import classes from './ChatRoom.module.css';
import http from '../../services/http_common';
import { redirectToLogin } from '../../services/Cookie';
import moment from '../../services/moment.locale.vi';

const fetchChatRooms = async () => {
    try {
        const response = await http.get('/admin/read/chatroom');
        const data = response.data;

        if (data.error === true && data.errortype === 'auth') {
            redirectToLogin();
            return;
        }

        if (data.success === true) {
            return data.chatRoom;
        } else {
            throw new Error('Unknown error');
        }
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
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

const ChatRoom = () => {
    const [chatRoomList, setChatRoomList] = useState([]);
    const [summary, setSummary] = useState({men: 0, women: 0, unk: 0});

    useEffect(() => {
        const getChatRooms = async () => {
            const data = await fetchChatRooms();
            if (data) {
                console.log("Chat Room Data: ", data);
                // Fetch user data for each chat room entry
                const chatRoomWithUserData = await Promise.all(data.map(async (entry) => {
                    const userProfile1 = await fetchUserData(entry.id1);
                    const userProfile2 = await fetchUserData(entry.id2);
                    if (userProfile1 === null || userProfile2 === null) return null;

                    return { ...entry, userProfile1, userProfile2 };
                }));
                if (chatRoomWithUserData.includes(null)) return; // Error fetching user data

                chatRoomWithUserData.sort((a, b) => b.time - a.time);
                setChatRoomList(chatRoomWithUserData);

                // Calculate summary
                const summary = chatRoomWithUserData.reduce((acc, e) => {
                    if (e.userProfile1.gender === 'female') acc.women++;
                    else if (e.userProfile1.gender === 'male') acc.men++;
                    else acc.unk++;

                    if (e.userProfile2.gender === 'female') acc.women++;
                    else if (e.userProfile2.gender === 'male') acc.men++;
                    else acc.unk++;

                    return acc;
                }, { men: 0, women: 0, unk: 0 });

                setSummary(summary);
            }
        };

        getChatRooms();
        const intervalId = setInterval(getChatRooms, 10000); // Fetch chat room data every 10 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <div className={classes.small_container}>
            <h3 className={classes.title}>Phòng chat</h3>
            <div className={classes.description}>Danh sách phòng chat hiện tại có ({chatRoomList.length / 2} cặp - {chatRoomList.length} người: {summary.men} nam, {summary.women} nữ, {summary.unk} khác)</div>
            
            <div className={classes.chatroom_list}>
                {chatRoomList.map(chatroom => (
                    <div key={`${chatroom.id1}-${chatroom.id2}`} className={classes.chatroom}>
                        <div className={classes.content}>
                            <img className={classes.chatroom_img} src={chatroom.userProfile1.profile_pic} alt="Avatar người dùng 1" loading="lazy"/>
                            <div className={classes.chatroom_text}>
                                <div className={classes.chatroom_id}>ID: {chatroom.id1}</div>
                                <div className={classes.chatroom_name}>{chatroom.userProfile1.last_name} {chatroom.userProfile1.first_name} ({chatroom.userProfile1.gender === 'male' ? 'Nam' : chatroom.userProfile1.gender === 'female' ? 'Nữ' : 'Khác'})</div>
                            </div>
                            <img className={classes.chatroom_img} src={chatroom.userProfile2.profile_pic} alt="Avatar người dùng 2" loading="lazy"/>
                            <div className={classes.chatroom_text}>
                                <div className={classes.chatroom_id}>ID: {chatroom.id2}</div>
                                <div className={classes.chatroom_name}>{chatroom.userProfile2.last_name} {chatroom.userProfile2.first_name} ({chatroom.userProfile2.gender === 'male' ? 'Nam' : chatroom.userProfile2.gender === 'female' ? 'Nữ' : 'Khác'})</div>
                            </div>
                        </div>
                        <div className={classes.time}>
                            <div className={classes.chatroom_time}>{moment(chatroom.time).format('llll')}</div>
                        </div>
                        <hr className={classes.separate}/>
                    </div>
                ))}
                {/* <div className={classes.separate_mid}></div> */}
            </div>
        </div>
    );
}

export default ChatRoom;
