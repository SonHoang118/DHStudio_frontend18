import React, { useEffect, useState } from 'react';
import styleModule from './index.module.scss'
import axios from 'axios';
import LoadingComponent from '../LoadingConponent';

const ModalSelectStyleConponent = ({ onClose, onSubmit, selectedTypes, setSelectedTypes }) => {
    const [dataTypes, setDataTypes] = useState([]);

    const [isLoading, setIsLoading] = useState(false)

    const handleTypeClick = (type) => {
        if (editMode) return
        console.log('compare')
        if (selectedTypes.some(item => item._id === type._id)) {
            setSelectedTypes(selectedTypes.filter((selected) => selected._id !== type._id));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };
    const [editMode, setEditmode] = useState(false)
    const handleBlur = async (e, type) => {
        const access_token = localStorage.getItem('token')
        e.target.parentNode.style = 'border: 2px solid transparent'
        const newType = document.getElementById(type._id).innerText
        if (type.name === newType) return
        setIsLoading(true)

        if (selectedTypes.some(item => item._id === type._id)) {
            const newNameType = selectedTypes.find(item => item._id === type._id)
            newNameType.name = newType
        }
        await axios.put(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-type-product/${type._id}`, { name: newType }, {
            headers: {
                'token': `Bearer ${access_token}`
            }
        })
            .then(() => {
                setIsLoading(false)
            })
        handleGetData()
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();  // Ngăn việc thêm ký tự xuống dòng
            event.target.blur();     // Bỏ focus khỏi span
        }
    };

    //CALL API DATATYPE
    const handleGetData = async () => {
        setIsLoading(true)
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/get-all-type-product-name`)
        setDataTypes(response.data.types)
        setIsLoading(false)
    }
    useEffect(() => {
        handleGetData()
    }, [])


    const handleAddType = async () => {
        const access_token = localStorage.getItem('token')
        const newType = prompt('Nhập tên phong cách mới: ')
        if (newType) {
            setIsLoading(true)
            await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/create-new-type-product`, { name: newType }, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            })
                .then((response) => {
                    if (response.data.status === 409) {
                        alert("Phong cách này đã tồn tại")
                    }
                    setIsLoading(false)
                })
            handleGetData()
        }
    }

    const handleDeleteType = async (id) => {
        const access_token = localStorage.getItem('token')
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa phong cách này ?')
        if (confirmDelete) {
            setIsLoading(true)
            if (selectedTypes.some(item => item._id === id)) {
                setSelectedTypes(selectedTypes.filter((selected) => selected._id !== id));
            }
            await axios.delete(`${process.env.REACT_APP_BASE_URL_BACKEND}/delete-type-product/${id}`, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            })
                .then(() => {
                    setIsLoading(false)
                })
            handleGetData()
        }
    }
    const handleFocus = (e) => {
        e.target.parentNode.style = 'border: 2px solid #ffb900'
    };


    return (
        <div className={styleModule.overlay}>
            <div className={styleModule.form} style={{ width: 500 }}>
                <div className={styleModule.header}>
                    <h1>Chọn loại sản phẩm</h1>
                    <div className={styleModule.closeForm} onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>

                <div className={styleModule.body}>
                    {dataTypes.length ? (<div className={styleModule.types}>
                        <div className={styleModule.types_list}>
                            {dataTypes.map((type, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${styleModule.type} ${!editMode && (selectedTypes.some(item => item._id === type._id)) ? styleModule.active : ''}`}
                                        id={type._id}
                                        style={{ cursor: editMode ? 'auto' : 'pointer' }}
                                        onClick={() => handleTypeClick(type)}
                                    >
                                        <span role="textbox"
                                            className='typeSpanBox'
                                            suppressContentEditableWarning={true}
                                            contentEditable={editMode}
                                            onFocus={(e) => handleFocus(e)}
                                            onBlur={(e) => handleBlur(e, type)}
                                            onKeyDown={handleKeyDown}
                                        >
                                            {type.name}
                                        </span>
                                        {editMode && <i className={`fa-solid fa-circle-xmark ${styleModule.deleteType}`} onClick={() => handleDeleteType(type._id)}></i>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>) : (
                        <div className={styleModule.noData}><i className="fa-solid fa-file"></i><h2>Không có dữ liệu</h2></div>
                    )}
                </div>

                <div className={styleModule.footer}>
                    <span style={editMode ? { backgroundColor: '#ffb900' } : { backgroundColor: '#ccc' }} className={styleModule.editBtn} onClick={() => setEditmode(s => !s)}><i className="fa-solid fa-pen-to-square"></i></span>
                    <span className={styleModule.addBtn} onClick={handleAddType}><i className="fa-solid fa-circle-plus"></i></span>

                    <button
                        className='btnStyle'
                        onClick={onClose}
                    >Xác nhận</button>
                    <button
                        className='btnStyle'
                        onClick={onClose}
                    >Đóng</button>

                </div>
            </div>
            {isLoading && <LoadingComponent />}
        </div>
    )
}

export default ModalSelectStyleConponent