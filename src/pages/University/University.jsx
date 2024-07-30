import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import http from '../../services/http_common';
import { redirectToLogin } from '../../services/Cookie';
import { delay } from '../../services/utils';
import classes from './University.module.css';

const University = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [prompt, setPrompt] = useState(null);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const fetchPrompt = async () => {
        try {
            const response = await http.get('/admin/read/prompts');
            const data = response.data;
        
            if (data.error && data.errortype === 'auth') {
                toast.error('Phiên đăng nhập hết hạn!');
                await delay(1000);
                redirectToLogin();
                return null;
            }

            if (data.success) {
                if (data.prompt.length === 0) {
                    return { mode: 'normal', content: 'Chưa có thông tin về prompt và trường học trong cơ sở dữ liệu, bạn hãy thêm nó bằng cách sửa và lưu lại tại đây.' };
                }
                return data.prompt[0];
            } else {
                throw new Error('Unknown error');
            }
        } catch (error) {
            console.error('Error fetching prompt:', error);
            return null;
        }
    };

    const editPrompt = async (updatedPrompt) => {
        console.log("Update prompt: ", updatedPrompt);
        try {
            const response = await http.post('/admin/edit/prompt', { prompt: updatedPrompt });
            const data = response.data;

            if (data.error) {
                if (data.errortype === 'auth') {
                    toast.error('Phiên đăng nhập hết hạn!');
                    await delay(1000);
                    redirectToLogin();
                    return;
                }
                toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
                return;
            }
            toast.success('Cập nhật thành công!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating prompt:', error);
            toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    useEffect(() => {
        const getPrompt = async () => {
            const fetchedPrompt = await fetchPrompt();
            if (fetchedPrompt !== null) {
                setPrompt(fetchedPrompt);
            }
        };

        getPrompt();
    }, [isEditing]);

    return (
        <div className='custom_container'>
            <ToastContainer />
            <h2 className={classes.title}>Dữ liệu trường học</h2>
            <p className={classes.system}>Trường ĐH Khoa học tự nhiên</p>

            <div className={classes.small_container}>
                <div className='container-item'>
                    <div className='flex flex-row mb-3'>
                        <div className='info-title'>
                            <h3 className={classes.small_title}>Thông tin chung</h3>
                            <div className={classes.description}>Tổng hợp thông tin của trường ĐH Khoa học tự nhiên</div>
                        </div>
                        <div className={`${classes.edit} ms-auto`} onClick={() => setIsEditing(true)}>
                            <i className="fa-regular fa-pen-to-square"></i>
                        </div>
                    </div>

                    {prompt === null ? (
                        <div className={classes.loading}>Đang tải dữ liệu...</div>
                    ) : (
                        isEditing ? (
                            <div>
                                <div className={classes.prompt_wrapper}>
                                    <textarea
                                        className={classes.notepad}
                                        value={prompt.content}
                                        onChange={(e) => setPrompt({ mode: 'normal', content: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className={classes.action}>
                                    <div
                                        className={`${classes.button_action} ${classes.success}`}
                                        onClick={() => editPrompt(prompt)}
                                    >
                                        Lưu
                                    </div>
                                    <div
                                        className={`${classes.button_action} ${classes.destroy}`}
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Hủy
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={classes.expandableParagraphContainer}>
                                <div
                                    className={`${classes.expandableParagraph} ${isExpanded ? classes.expanded : classes.collapsed}`}
                                >
                                    {prompt.content}
                                </div>
                                <button className={classes.toggleButton} onClick={toggleExpand}>
                                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default University;
