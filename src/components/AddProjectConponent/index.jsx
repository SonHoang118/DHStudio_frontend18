import React, { useEffect, useState } from 'react'

import axios from 'axios';
import './index.scss'
import ModalSelectStyleConponent from '../ModalSelectStyleComponent';
import LoadingComponent from '../LoadingConponent';
import { slugify } from '../../utils/stringToSlugifi';

const AddProjectConponent = ({ handleDeleteAllImg, setShowAddProject, fetchProjects, data, setEditModeProject }) => {

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [openSelectType, setOpenSelectType] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setProjectData(prev => ({
            ...prev,
            style: selectedTypes.map(style => style._id)
        }))
    }, [selectedTypes])

    const handleCloseModal = () => {
        setOpenSelectType(false);
    };

    const handleGetData = async () => {
        console.log('first------', data)
        setIsLoading(true)
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/get-many-detail-type-product`, { idTypes: data?.style })
        setSelectedTypes(response.data)
        setIsLoading(false)
    }
    useEffect(() => {
        if (!setEditModeProject) return
        handleGetData()
    }, [])

    const [projectData, setProjectData] = useState(
        {
            imgs: [],
            name: '',
            investor: '',
            totalCost: '',
            location: '',
            date: '',
            style: [],
            nFloors: '',
            decs: '',
            area: '',
        })
    const [imgsDelete, setImgsDelete] = useState([])

    // useEffect(() => {
    //     data && setProjectData(data)
    // }, [])
    const handleGetDetailProject = async () => {
        setIsLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getDetailProject/${data.slugify}`)
        setProjectData(res?.data.project)
        setIsLoading(false)
    }
    useEffect(() => {
        if (!data) return
        handleGetDetailProject()
    }, [])


    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);

        const previews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setProjectData((prev) => ({
            ...prev,
            imgs: [...prev.imgs, ...previews],
        }));
        e.target.value = null; // reset input
    };


    const handleRemoveImage = async (index, imgId) => {
        setProjectData((prev) => ({
            ...prev,
            imgs: prev.imgs.filter((_, i) => i !== index),
        }));
        setImgsDelete(prev => [...prev, imgId])
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClickConfirm = async () => {
        if (!checkInvalid()) {
            alert("Vui lòng nhập các trường không được để trống: *ảnh, *tên dự án");
            return;
        }
        try {
            setIsLoading(true)
            const access_token = localStorage.getItem('token')
            const uploadPreset = 'DHStudio';
            const cloudName = 'dcqivfwxv';

            const uploadPromises = projectData.imgs.map(async (img) => {
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
                ...projectData,
                imgs: validImgs.map((img) => ({ link: img.link, id: img.id })),
                totalCost: Number(projectData.totalCost),
                nFloors: Number(projectData.nFloors),
                slugify: slugify(projectData.name)
            };
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/createProject`, payload, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            });

            if (!response.data.status) {
                alert('Không thể tạo dự án');
            } else {
                axios.patch(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-add-products`, {
                    idsType: selectedTypes.map(type => type._id),
                    idProduct: response.data.project?._id
                }, {
                    headers: {
                        'token': `Bearer ${access_token}`
                    }
                }).then(() => {
                    setShowAddProject(false);
                    fetchProjects();
                    alert('Tạo dự án thành công!');
                    setIsLoading(false)
                })
            }
        } catch (error) {
            console.error('Lỗi khi tạo dự án:', error);
            setIsLoading(false)
            alert('Tạo dự án thất bại!');
        }
        console.log('projectData', projectData)

    };


    const handleClickUpdate = async () => {
        if (!checkInvalid()) {
            alert("Vui lòng nhập các trường không được để trống: *ảnh, *tên dự án, *chủ đầu tư, *tổng chi phí, *địa điểm, *thời gian khởi công");
            return;
        }
        try {
            setIsLoading(true)
            const access_token = localStorage.getItem('token')
            let payload
            if (imgsDelete.length !== 0) {
                await handleDeleteAllImg(imgsDelete.filter(img => img !== undefined));
            }

            if (projectData.imgs.some(img => img.file)) {

                const uploadPreset = 'DHStudio';
                const cloudName = 'dcqivfwxv';

                const uploadPromises = projectData.imgs.map(async (img) => {
                    if (img.link) return
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
                const validImgs = uploadedImgs.filter((img) => img !== (null || undefined));
                payload = {
                    ...projectData,
                    imgs: [...projectData.imgs.filter(img => img.link && img.id), ...validImgs.map((img) => ({ link: img.link, id: img.id }))],
                    totalCost: Number(projectData.totalCost),
                    nFloors: Number(projectData.nFloors),
                    slugify: slugify(projectData.name)
                }
            }
            else {
                payload = {
                    ...projectData,
                    totalCost: Number(projectData.totalCost),
                    nFloors: Number(projectData.nFloors),
                    slugify: slugify(projectData.name)
                };
            }
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-project/${projectData._id}`, payload, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            });

            if (!response.data.status) {
                alert('Không thể cập nhật dự án');
            } else {

                axios.patch(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-delete-products`, {
                    idsType: data.style.filter(id => !projectData.style.includes(id)),
                    idProduct: data?._id
                }).then(() => {
                    axios.patch(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-add-products`, {
                        idsType: projectData.style.filter(id => !data.style.includes(id)),
                        idProduct: data?._id
                    }, {
                        headers: {
                            'token': `Bearer ${access_token}`
                        }
                    }).then(() => {
                        // setShowAddProject(false);
                        fetchProjects();
                        alert('Cập nhật dự án thành công!');

                        setIsLoading(false)
                        setEditModeProject(null)
                    })
                })

            }

        } catch (error) {
            setIsLoading(false)
            alert('Cập nhật dự án thất bại!');
        }
    }


    const checkInvalid = () => {
        return !!(
            projectData.imgs.length != 0 &&
            projectData.name
        );
    };


    return (
        <div className="container" style={{ margin: '100px auto' }}>
            <div className="top">

                <div className="left">
                    <div className='product_show'>
                        <div className='product_show_main'>
                            {projectData?.date&& data  && <div className='timeData'>
                                <span>tạo lúc -
                                    {new Date(projectData?.createdAt).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </span>
                                <span>cập nhật lần cuối -
                                    {new Date(projectData?.updatedAt).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </span>
                            </div>}
                            {projectData.imgs.length === 0 ? (<><label className='selectMain' htmlFor='mainImg'><i className="fa-solid fa-plus"></i></label>
                                <input id='mainImg' type='file' hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                /></>) : (



                                <div className='mainImgShow'>
                                    <a className='mainImgShowHiden' href={projectData.imgs[0].preview || projectData.imgs[0].link} target="_blank" rel="noopener noreferrer">
                                        <img src={projectData.imgs[0].preview || projectData.imgs[0].link} />
                                    </a>
                                    <i onClick={() => handleRemoveImage(0, projectData.imgs[0].id)} className='fa-duotone fa-solid fa-circle-xmark deleteImg'></i>
                                </div>
                            )}

                        </div>
                        <div className='product_show_sub'>
                            {projectData.imgs.map((image, index) => {
                                if (index === 0) return
                                return (
                                    <div key={index} className='subImg'>
                                        <a href={image.preview || image.link} target="_blank" rel="noopener noreferrer">
                                            <img src={image.preview || image.link} />
                                        </a>
                                        <i onClick={() => { handleRemoveImage(index, image.id) }} className='fa-solid fa-circle-xmark deleteImg'></i>
                                    </div>
                                )
                            }
                            )}
                            {projectData.imgs.length !== 0 && <div>
                                <label className='selectMoreImg' htmlFor='mainImg'><i className="fa-solid fa-plus"></i></label>
                                <input id='mainImg' type='file' hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>}
                        </div>
                    </div>

                </div>
                <div className="right">
                    <h3>Thông tin dự án</h3>
                    <div className="input_group">
                        <label htmlFor="name">Tên dự án</label>
                        <input type="text"
                            name="name"
                            value={projectData?.name || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="investor">Chủ đầu tư</label>
                        <input type="text"
                            name="investor"
                            value={projectData?.investor || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="total">Tổng chi phí</label>
                        <input type="text"
                            name="totalCost"
                            value={projectData?.totalCost || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="location">Địa điểm</label>
                        <input type="text"
                            name="location"
                            value={projectData?.location || ''}
                            onChange={handleInputChange} />
                    </div>
                    <div className="input_group">
                        <label htmlFor="area">Diện tích (m2)</label>
                        <input type="text"
                            name="area"
                            value={projectData?.area || ""}
                            onChange={handleInputChange} />
                    </div>
                    <div className="input_group">
                        <label htmlFor="location">Thời gian khởi công</label>
                        <input type="date"
                            name="date"
                            value={projectData?.date || ''}
                            onChange={handleInputChange} />
                    </div>
                    <div className='inputGroup'>
                        <button className='btnStyle' onClick={() => setOpenSelectType(true)}>Phong cách<i className="fa-solid fa-circle-plus"></i></button>
                        {openSelectType && <ModalSelectStyleConponent
                            onClose={handleCloseModal}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                        />}
                        {selectedTypes.length > 0 && (
                            <div>
                                {selectedTypes.map((type, i) => (<span className='tagName' key={i}>{type.name}</span>))}
                            </div>
                        )
                        }
                    </div>


                    <div className="input_group">
                        <label htmlFor="location">Số tầng</label>
                        <input type="text"
                            name="nFloors"
                            value={projectData?.nFloors || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className="decsGroup">
                <div className="input_group">
                    <label htmlFor="decs">Mô tả</label>
                    <textarea name="decs" id="decs"
                        value={projectData?.decs || ''}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
            </div>
            {
                !setEditModeProject ?
                    (<button style={{ padding: '15px', backgroundColor: '#1fd760' }} onClick={() => handleClickConfirm()}>Xác nhận</button>)
                    :
                    (<button style={{ padding: '15px', backgroundColor: '#1fd760' }} onClick={() => handleClickUpdate()}>Cập nhật</button>)
                // (changed && <button style={{ padding: '15px', backgroundColor: '#1fd760' }} onClick={() => handleClickUpdate()}>Cập nhật</button>)
            }
            {isLoading && <LoadingComponent />}
        </div>
    )
}

export default AddProjectConponent