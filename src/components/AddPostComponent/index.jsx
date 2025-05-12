import React, { useEffect, useState } from 'react'
import ReactQuillComponent from '../ReactQuillComponent'
import axios from 'axios'
import LoadingComponent from '../LoadingConponent'
import { slugify } from '../../utils/stringToSlugifi'

const AddPostConponent = ({ setShowAddPost, fetchPosts, data, handleDeleteAllImg, setEditModePost }) => {
    const [postContent, setPostContent] = useState()
    const [postData, setPostData] = useState({
        imgTitle: '',
        title: '',
        content: '',
        imgsId: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null);
    useEffect(() => {
        if (postData?.imgTitle instanceof File) {
            const objectUrl = URL.createObjectURL(postData?.imgTitle);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl); // cleanup
        } else if (typeof postData?.imgTitle === 'string') {
            setPreviewUrl(postData?.imgTitle);
        }
    }, [postData?.imgTitle]);

    const handleGetDetailPost = async () => {
        setIsLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getDetailPost/${data.slugify}`)
        setPostData(res.data?.post)
        setPostContent(res.data?.post.content)
        setIsLoading(false)
    }

    useEffect(() => {
        if (!data) return
        handleGetDetailPost()
    }, [])

    const handleSubmit = async (typeSubmit) => {
        if (!checkInvalid()) {
            alert("Vui lòng nhập các trường không được để trống: *ảnh, *tiêu đề bài viết, *nội dung bài viết");
            return;
        }
        setIsLoading(true)


        const result = await extractAndUploadImages(postContent, postData.imgTitle);
        console.log('1-----------', postData.imgTitle)
        const payload = {
            imgTitle: result.imgTitleUrl,
            title: postData.title,
            content: JSON.stringify({ blocks: result.blocks, entityMap: result.entityMap }),
            imgsId: result.imgsId,
            slugify: slugify(postData.title)
        };

        const access_token = localStorage.getItem('token')
        if (typeSubmit === 'create') {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/createPost`, payload, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            });
            if (!response.data.status) {
                alert('Không thể tạo bài viết');
                setIsLoading(false)
            } else {
                setShowAddPost(false);
                fetchPosts();
                alert('Tạo bài viết thành công!');
                setIsLoading(false)
            }
        }
        else if (typeSubmit === 'update') {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-post/${data?._id}`, payload, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            });
            if (!response.data.status) {
                alert('Không thể sửa bài viết');
                setIsLoading(false)
            } else {
                setEditModePost(null);
                fetchPosts();
                alert('Sửa bài viết thành công!');
                setIsLoading(false)
            }
        }

        return result.imgsId

    };
    const handleUpdatePost = async () => {
        if (!checkInvalid()) {
            alert("Vui lòng nhập các trường không được để trống: *ảnh, *tiêu đề bài viết, *nội dung bài viết");
            return;
        }
        const res = await handleSubmit('update') // <-- thêm await
        var deleteImgsList
        if (postData.imgTitle instanceof File) {
            deleteImgsList = postData.imgsId
        }
        else {
            deleteImgsList = postData.imgsId.filter(img => img.link !== postData.imgTitle)
        }
        const imgsToDelete = deleteImgsList.filter(
            delImg => !res.some(img => img.id === delImg.id)
        );
        if (imgsToDelete.length != 0) {
            handleDeleteAllImg(imgsToDelete.map(img => img.id))
        }
    }


    const uploadImageToCloudinary = async (fileOrBase64) => {
        const uploadPreset = 'DHStudio';
        const cloudName = 'dcqivfwxv';
        const formData = new FormData();
        formData.append('file', fileOrBase64);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data;
    };

    const extractAndUploadImages = async (postContent, imgTitleFile) => {
        const updatedEntityMap = { ...postContent.entityMap };
        const uploadPromises = [];
        const imgs = [];
        let imgTitleUrl = null;

        // console.log('2-----------', imgTitleFile)
        // console.log('3-----------', postData.imgsId)
        if (imgTitleFile instanceof File) {
            imgTitleUrl = await uploadImageToCloudinary(imgTitleFile);
            imgs.push({ link: imgTitleUrl.secure_url, id: imgTitleUrl.public_id });
        }
        else {
            imgs.push(postData.imgsId.find(img => img.link == imgTitleFile))
        }

        console.log(updatedEntityMap)
        Object.entries(updatedEntityMap).forEach(([key, entity]) => {
            if (entity.type === 'IMAGE' && entity.data?.src?.startsWith('data:image')) {
                const base64Image = entity.data.src;
                const uploadPromise = (async () => {
                    const cloudUrlFromBase64 = await uploadImageToCloudinary(base64Image);
                    updatedEntityMap[key].data.src = cloudUrlFromBase64.secure_url;
                    imgs.push({ link: cloudUrlFromBase64.secure_url, id: cloudUrlFromBase64.public_id });
                })();
                uploadPromises.push(uploadPromise);
            } else if (entity.type === 'IMAGE') {
                const existingImg = postData.imgsId.find(img => img.link === entity.data?.src);
                console.log('postData.imgsId', postData.imgsId)
                console.log('them', existingImg)
                if (existingImg) imgs.push(existingImg);
            }
        });

        await Promise.all(uploadPromises);
        return {
            ...postContent,
            entityMap: updatedEntityMap,
            imgTitleUrl: imgTitleFile instanceof File ? imgTitleUrl.secure_url : imgTitleFile,
            imgsId: imgs,
        };
    };
    const checkInvalid = () => {
        return !!(
            postData.imgTitle != '' &
            postData.title != ''
        );
    };


    return (
        <div className="container" style={{ margin: '100px auto' }}>
            <div className="input_group">

                <label htmlFor="">Ảnh tiêu đề</label>
                <input type="file" accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setPostData(prev => ({
                                ...prev,
                                imgTitle: file
                            }));
                        }
                    }} />
                {previewUrl && (
                    <div style={{ marginTop: '10px' }}>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                )}


            </div>
            <div className="input_group" style={{ margin: '10px 0' }}>
                <label htmlFor="name">Tiêu đề bài viết</label>
                <input type="text"
                    style={{ width: '90%', fontWeight: 600 }}
                    value={postData?.title || ""}
                    onChange={(e) => {
                        setPostData(prev =>
                        ({
                            ...prev,
                            title: e.target.value
                        })
                        )
                    }}
                />
            </div>
            {(!data || (data && postContent)) && <ReactQuillComponent
                text={postContent}
                setText={setPostContent}
            />}
            {data ? (<button style={{ padding: '15px', backgroundColor: '#1fd760' }} onClick={handleUpdatePost}>Cập nhật</button>)
                :
                (<button style={{ padding: '15px', backgroundColor: '#1fd760' }} onClick={() => handleSubmit('create')}>Xác nhận</button>)}
            {isLoading && <LoadingComponent />}
        </div >
    )
}

export default AddPostConponent