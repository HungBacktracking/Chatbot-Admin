import React, { useState, useRef } from 'react'
import { FileUpload } from 'primereact/fileupload';
import { toast as reactToast, ToastContainer } from 'react-toastify';
import 'primereact/resources/themes/saga-blue/theme.css';       // Theme của PrimeReact 
import 'primereact/resources/primereact.min.css';               // CSS của PrimeReact
import 'primeicons/primeicons.css';                             // CSS của PrimeIcons
import 'primeflex/primeflex.css';                               // CSS của PrimeFlex
import './Monitor.css';                                       
import classes from './Monitor.module.css';
import http from '../../services/http_common';
import { redirectToLogin } from '../../services/Cookie';
import { delay, getDateStr } from '../../services/utils';
import WaitRoom from '../../components/WaitRoom/WaitRoom';

const Monitor = () => {
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const fileUploadRef = useRef(null);
    const [backupSelected, setBackupSelected] = useState(null);

    const sentBroadcast = async (broadcastContent) => {
        try {
            const response = await http.post('/admin/broadcast', { content: broadcastContent });
            const data = response.data;

            if (data.error === true) {
                if (data.errortype === 'auth') {
                    reactToast.error('Phiên đăng nhập hết hạn!');
                    await delay(1000);
                    redirectToLogin();
                    return;
                }
                reactToast.error('Có lỗi xảy ra khi gửi tin nhắn broadcast!');
                return;
            }
            reactToast.success('Gửi tin nhắn broadcast thành công!');
        } catch (error) {
            console.error('Error sending broadcast:', error);
            reactToast.error('Có lỗi xảy ra khi gửi tin nhắn broadcast!');
        }
    };


    const fetchUserData = async (id) => {
        try {
            const response = await http.post('/admin/userinfo', { id });
            const data = response.data;
    
            if (data.error === true) {
                if (data.errortype === 'auth') {
                    reactToast.error('Phiên đăng nhập hết hạn!');
                    await delay(1000);
                    redirectToLogin();

                    return;
                }
                reactToast.error('Không thể lấy thông tin người dùng này!');
                setUserProfile(null);

                return;
            }
            reactToast.success('Lấy thông tin người dùng thành công!');
            setUserProfile(data.userProfile);
        } catch (error) {
            console.error(`Error fetching user data for ID ${id}:`, error);

            reactToast.error('Không thể lấy thông tin người dùng này!');
            setUserProfile(null);
        }
    };

    const getBackupFileName = () => {
        return 'hcmuschat_backup_' + getDateStr(-1).replace(/\//g, '-').replace(/\:/g, '-').replace(/\s+/, '_') + '.json';
    };

    const downloadBackupFile = (filename, data) => {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none'; 

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getBackupFile = async () => {
        try {
            const response = await http.get('/admin/backup');
            const data = response.data;

            if (data.error === true) {
                if (data.errortype === 'auth') {
                    reactToast.error('Phiên đăng nhập hết hạn!');
                    await delay(1000);
                    redirectToLogin();
                    return;
                }
                reactToast.error('Không thể tải file sao lưu!');
                return;
            }

            let backupData = {
                user: data.user,
                lastPerson: data.lastPerson,
                waitRoom: data.waitRoom,
                chatRoom: data.chatRoom,
                prompt: data.prompt,
            }
            downloadBackupFile(getBackupFileName(), JSON.stringify(backupData));
            reactToast.success('Tải file sao lưu thành công!');
        } catch (error) {
            console.error('Error getting backup file:', error);
            reactToast.error('Không thể tải file backup!');
        }
    };

    const handleSelectBackupFile = async (event) => {
        setBackupSelected(event.files[0]);
    }

    const clearSelectedFile = () => {
        setBackupSelected(null);
        if (fileUploadRef.current) {
            fileUploadRef.current.clear(); // Xóa file đã chọn trong FileUpload
        }
    };

    const restoreData = async () => {
        if (!backupSelected) {
            reactToast.error('Vui lòng chọn file sao lưu!');
            return;
        }

        try {
            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    const jsonContent = JSON.parse(content);
                    console.log('JSON content:', jsonContent);

                    const response = await http.post('/admin/restore', jsonContent);
                    const data = response.data;

                    if (data.error === true) {
                        if (data.errortype === 'auth') {
                            reactToast.error('Phiên đăng nhập hết hạn!');
                            await delay(1000);
                            redirectToLogin();
                            return;
                        }
                        reactToast.error('Không thể khôi phục dữ liệu!');
                        clearSelectedFile();
                        return;
                    }

                    reactToast.success('Khôi phục dữ liệu thành công!');
                    clearSelectedFile();
                } catch (error) {
                    console.error('Error parsing or sending JSON:', error);
                    reactToast.error('Không thể khôi phục dữ liệu!');
                    clearSelectedFile();
                }
            };
            fileReader.readAsText(backupSelected); // Đọc tệp đã chọn dưới dạng văn bản
        } catch (error) {
            console.error('Error restoring data:', error);
            reactToast.error('Không thể khôi phục dữ liệu!');
            clearSelectedFile();
        }
    };

    const resetDatabase = async () => {
        try {
            const response = await http.post('/admin/db/reset');
            const data = response.data;

            if (data.error === true) {
                if (data.errortype === 'auth') {
                    reactToast.error('Phiên đăng nhập hết hạn!');
                    await delay(1000);
                    redirectToLogin();
                    return;
                }
                reactToast.error('Không thể xóa dữ liệu!');
                return;
            }

            reactToast.success('Xóa dữ liệu thành công!');
        } catch (error) {
            console.error('Error resetting database:', error);
            reactToast.error('Không thể xóa dữ liệu!');
        }
    };

    return (
        <div className='custom_container'>
            <ToastContainer />
            <h2 className={classes.title}>Điều khiển</h2>
            <p className={classes.system}>Trung tâm điều khiển Chatbot</p>

            <div className={classes.small_container}>
                <div className='container-item'>
                    <h3 className={classes.small_title}>Broadcast</h3>
                    <div className={classes.description}>Gửi tin nhắn tới toàn bộ người dùng của fanpage</div>
                    <div className={classes.broadcast_wrapper}>
                        <textarea className={classes.notepad} value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)}></textarea>
                    </div>
                    <div className={classes.action}>
                        <div className={`${classes.button_action} ${classes.success}`} onClick={() => sentBroadcast(broadcastMessage)}>
                            Gửi đi
                        </div>
                        <div className={`${classes.button_action} ${classes.destroy}`} onClick={() => {setBroadcastMessage(''); }}>
                            Xóa tin 
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.small_container}>
                <div className='container-item'>
                    <h3 className={classes.small_title}>Kiểm tra info</h3>
                    <div className={classes.description}>Kiểm tra thông tin người dùng dựa trên ID</div>

                    {
                        userProfile == null ? (
                            <div className={classes.info}>
                                <img className={classes.info_img} src='./avatar.png' alt="User's avatar" />
                                <div className={classes.info_text}>
                                    <p className={classes.info_name}>Thông tin: Profile và giới tính người dùng</p>
                                    <p className={classes.info_id}>ID: Mã ID của người dùng</p>
                                </div>
                            </div>
                        ) : (
                            <div className={classes.info}>
                                <img className={classes.info_img} src={userProfile.profile_pic} alt="User's avatar" />
                                <div className={classes.info_text}>
                                    <p className={classes.info_name}>Thông tin: {userProfile.last_name} {userProfile.first_name} { userProfile.gender === 'male' ? '(Nam)' : userProfile.gender === 'female' ? '(Nữ)' : '' }</p>
                                    <p className={classes.info_id}>ID: {userProfile.id}</p>
                                </div>
                            </div>
                        )
                    }

                    <div className={classes.check_info_wrapper}>
                        <textarea className={classes.notepad} value={userId} onChange={(e) => setUserId(e.target.value)}></textarea>
                    </div>
                    <div className={classes.action}>
                        <div className={`${classes.button_action} ${classes.success}`} onClick={() => fetchUserData(userId)}>
                            Kiểm tra
                        </div>
                    </div>
                </div>

            </div>
            
            

            <h3 className={classes.medium_title} style={{marginBottom: 0.6 + 'em'}}>Danger Zone</h3>
            <div className={`${classes.danger_container} ${classes.destroy_1px}`}>
                <div className={classes.danger_item}>
                    <div className={classes.danger_text}>
                        <p className={classes.danger_title}>Sao lưu dữ liệu</p>
                        <p className={classes.danger_description}>Tạo bản sao lưu cho bộ dữ liệu hiện tại</p>
                    </div>
                    <div className={`${classes.danger_action}`} onClick={() => getBackupFile()}>
                        Sao lưu
                    </div>
                </div>

                <div className={classes.danger_item}>
                    <div className={classes.danger_text}>
                        <p className={classes.danger_title}>Khôi phục dữ liệu</p>
                        <p className={classes.danger_description}>Khôi phục một trạng thái dữ liệu</p>
                    </div>
                    <div className='ms-auto flex flex-column gap-3'>
                        <div className="flex flex-row">
                            <div className={classes.danger_action_description}>Chọn tệp khôi phục:</div>
                            <FileUpload ref={fileUploadRef} mode="basic" name="demo[]" accept="application/json" onClear={() => setBackupSelected(null)} onSelect={handleSelectBackupFile} chooseLabel='Duyệt trên thiết bị' />
                        </div>
                        <div className={backupSelected && fileUploadRef.current ? `${classes.danger_action} no-ms` : `${classes.danger_action} ${classes.disable} no-ms`} onClick={restoreData}>
                            Khôi phục
                        </div>
                    </div>
                </div>
                

                <div className={classes.danger_item}>
                    <div className={classes.danger_text}>
                        <p className={classes.danger_title}>Xóa dữ liệu</p>
                        <p className={classes.danger_description}>Xóa toàn bộ dữ liệu trên hệ thống!</p>
                    </div>
                    <div className={`${classes.danger_action}`} onClick={resetDatabase}>
                        Xóa dữ liệu
                    </div>
                </div>
                

            </div>
        </div>
    );
};

export default Monitor;