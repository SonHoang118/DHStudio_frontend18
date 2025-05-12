import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoadingComponent from '../LoadingConponent';

const BannerSettingConponent = ({ setSetBanner, handleDeleteAllImg, imgsBannerf }) => {
    const [imgsBanner, setImgsBanner] = useState([])
    const [imgsDelete, setImgsDelete] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setImgsBanner(imgsBannerf)
    }, [])



    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImgsBanner((prev) => [
            ...prev,
            ...previews, // dàn phẳng mảng previews
        ]);
        e.target.value = null;
    };
    const handleRemoveImage = async (index, imgId) => {
        setImgsBanner((prev) => ([
            ...prev.filter((_, i) => i !== index),
        ]));
        setImgsDelete(prev => [...prev, imgId])
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            const access_token = localStorage.getItem('token')
            const uploadPreset = 'DHStudio';
            const cloudName = 'dcqivfwxv';

            const uploadPromises = imgsBanner.map(async (img) => {
                // Nếu ảnh đã upload rồi (có link), thì bỏ qua
                if (img.link && img.id) return img;

                const formData = new FormData();
                formData.append('file', img.file);
                formData.append('upload_preset', uploadPreset);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok && data.secure_url) {
                    return {
                        file: img.file,
                        preview: img.preview,
                        link: data.secure_url,
                        id: data.public_id,
                    };
                } else {
                    console.error('Upload failed:', data.error || data);
                    return null;
                }
            });

            const uploadedImgs = await Promise.all(uploadPromises);
            const validImgs = uploadedImgs.filter((img) => img !== null);

            const payload = {
                imgsBanner: validImgs.map((img) => ({ link: img.link, id: img.id })),
            };

            // const response = await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/createProject`, payload);
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-web-infor/681da29b0495733ecfbb5442`,
                payload, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            }).then((res) => {
                if (res.status === 200) {
                    alert('cập nhật thành công!');
                    setIsLoading(false)
                } else {
                    alert('Không thể cập nhật');
                    setIsLoading(false)
                }
            })


        } catch (error) {
            setIsLoading(false)
            alert('cập nhật thất bại!');
        }
        if (imgsDelete.some(img => img !== undefined)) {
            handleDeleteAllImg(imgsDelete.filter(img => img !== (null || undefined)))
            console.log(imgsDelete)
        }
        console.log('img', imgsBanner)
    }


    return (
        <div className='product_show' style={{ marginTop: '30px' }}>
            <div className='product_show_main' style={{ width: '80%' }}>
                {imgsBanner.length === 0 ? (<><label className='selectMain' htmlFor='mainImg' style={{ width: '100%' }}><i className="fa-solid fa-plus" ></i></label>
                    <input id='mainImg' type='file' hidden
                        multiple
                        accept=".png, .jpg, .jpeg"
                        onChange={handleImageChange}
                    /></>) : (



                    <div className='mainImgShow'>
                        <a className='mainImgShowHiden' href={imgsBanner[0].preview || imgsBanner[0].link} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                            <img src={imgsBanner[0].preview || imgsBanner[0].link} />
                        </a>
                        <i onClick={() => handleRemoveImage(0, imgsBanner[0].id)} className='fa-duotone fa-solid fa-circle-xmark deleteImg'></i>
                    </div>
                )}

            </div>
            <div className='product_show_sub'>
                {imgsBanner.map((image, index) => {
                    if (index === 0) return
                    return (
                        <div key={index} className='subImg'>
                            <a href={image.preview || image.link} target="_blank" rel="noopener noreferrer">
                                <img style={{ width: '100px' }} src={image.preview || image.link} />
                            </a>
                            <i onClick={() => { handleRemoveImage(index, image.id) }} className='fa-solid fa-circle-xmark deleteImg'></i>
                        </div>
                    )
                }
                )}
                {imgsBanner.length !== 0 && <div>
                    <label className='selectMoreImg' htmlFor='mainImg'><i className="fa-solid fa-plus"></i></label>
                    <input id='mainImg' type='file' hidden
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>}
            </div>
            <button onClick={handleSubmit}>Cập nhật</button>
            {isLoading && <LoadingComponent />}
        </div>
    )
}

export default BannerSettingConponent