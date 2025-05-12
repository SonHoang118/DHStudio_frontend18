import React, { useEffect, useState } from 'react'

import projectIcon from '../../assets/images/001-folders.png'
import newsPaperIcon from '../../assets/images/newspaper.png'

import editIcon from '../../assets/images/001-edit.png'
import deleteIcon from '../../assets/images/002-delete.png'
import imageIcon from '../../assets/images/001-picture.png'
import removeIcon from '../../assets/images/remove.png'

import './index.scss'
import AddPostConponent from '../../components/AddPostComponent'
import AddProjectConponent from '../../components/AddProjectConponent'
import axios from 'axios'
import { priceDisplay } from '../../utils/priceDisplay'
import BannerSettingConponent from '../../components/BannerSettingComponent'
import LoadingComponent from '../../components/LoadingConponent'

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminPage = () => {
    const [showProject, setShowProject] = useState(false);

    const [showAddPost, setShowAddPost] = useState(false)
    const [showAddProject, setShowAddProject] = useState(false)
    const [setBanner, setSetBanner] = useState(false)


    const [loading, setLoading] = useState(true);


    const [editModeProject, setEditModeProject] = useState()
    const [editModePost, setEditModePost] = useState()

    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [imgsBannerf, setImgsBannerf] = useState([])
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllProject`);
            setProjects(response.data.projects);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách project:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // Gọi API khi component mount

        fetchProjects();
    }, []); // dependency rỗng => chỉ chạy 1 lần khi component mount

    const fetchImgsBanner = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getWebInfo`);
            setImgsBannerf(response.data.infoData[0].imgsBanner);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách img:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // Gọi API khi component mount

        fetchImgsBanner();
    }, []); // dependency rỗng => chỉ chạy 1 lần khi component mount

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllPosts`);
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách posts:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // Gọi API khi component mount

        fetchPosts();
    }, []); // dependency rỗng => chỉ chạy 1 lần khi component mount


    const handleDeleteAllImg = async (imgsDelete) => {
        try {
            const access_token = localStorage.getItem('token')
            const res = await axios.delete(`http://localhost:3002/delete-images`, {
                data: { ids: imgsDelete }, // 👈 body khi dùng DELETE
                headers: {
                    'Content-Type': 'application/json',
                    'token': `Bearer ${access_token}`
                }
            });
            if (!res.data.status) {
                alert('Không thể xoá ảnh từ Cloudinary');
            }
        } catch (error) {
            console.error('Lỗi khi xoá ảnh:', error);
            alert('Lỗi khi xoá ảnh');
        }
    };
    const handleDeleteProject = async (i, id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa dự án này không?");
        if (!confirmDelete) return;
        try {
            const access_token = localStorage.getItem('token')
            const imgsDelete = projects[i].imgs.map(img => img.id);
            handleDeleteAllImg(imgsDelete)
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL_BACKEND}/deleteProject/${id}`, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    if (!res.data.status) {
                        alert('Không thể xóa dự án');
                    }
                    else {
                        axios.patch(`${process.env.REACT_APP_BASE_URL_BACKEND}/update-delete-products`, {
                            idsType: projects[i].style,
                            idProduct: id
                        }).then(() => {
                            fetchProjects()
                            setEditModeProject(null)
                            alert('Xóa dự án thành công');
                        })
                    }
                })
        } catch (error) {
            alert('Đã có lỗi xảy ra');
        }
    }

    const handleDeletePost = async (i, id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
        if (!confirmDelete) return;
        try {
            handleDeleteAllImg(posts[i].imgsId.map(img => img.id))
            const access_token = localStorage.getItem('token')
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL_BACKEND}/deletePost/${id}`, {
                headers: {
                    'token': `Bearer ${access_token}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    if (!res.data.status) {
                        alert('Không thể xóa bài viết');
                    }
                    else {
                        fetchPosts()
                        setEditModePost(null)
                        alert('Xóa bài viết thành công');
                    }
                })
        } catch (error) {
            alert('Đã có lỗi xảy ra');
        }

    }

    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/system/authorization/admin/login');
                return;
            }
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000; // giây

                if (decoded.exp < currentTime) {
                    alert('Đăng nhập đã hết hạn!');
                    localStorage.removeItem('token');
                    navigate('/system/authorization/admin/login');
                }
                if (!decoded.isAdmin) {
                    alert('Bạn không có quyền truy cập trang admin');
                    navigate('/system/authorization/admin/login');
                }
            } catch (err) {
                console.error('Token không hợp lệ:', err);
                localStorage.removeItem('token');
                navigate('/system/authorization/admin/login');
            }
        }, 20000);
        return () => clearInterval(intervalId); // ✅ Cleanup khi unmount
    }, [navigate]);


    return (
        <div className='addminPage'>
            <h1>Đăng nhập thành công</h1>

            <div className='btnFnContainer'>
                <button className="btn"
                    onClick={() => {
                        setShowAddProject(prev => !prev)
                        setShowAddPost(false)
                        setSetBanner(false)
                        setEditModeProject(null)
                    }} style={{ backgroundColor: showAddProject ? '#cdcdcd' : '#fff' }}>
                    <img src={projectIcon} alt="" />
                    <span>Thêm dự án</span>
                </button>
                <button className="btn"
                    onClick={() => {
                        setShowAddPost(prev => !prev)
                        setShowAddProject(false)
                        setSetBanner(false)
                    }} style={{ backgroundColor: showAddPost ? '#cdcdcd' : '#fff' }}>

                    <img src={newsPaperIcon} alt="" />
                    <span>Thêm bài viết</span>
                </button>
                <button className="btn"
                    onClick={() => {
                        setSetBanner(prev => !prev)
                        setShowAddPost(false)
                        setShowAddProject(false)
                    }} style={{ backgroundColor: setBanner ? '#cdcdcd' : '#fff' }}>

                    <img src={imageIcon} alt="" />
                    <span>Thay đổi ảnh banner</span>
                </button>
            </div>

            {showAddPost && <AddPostConponent setShowAddPost={setShowAddPost} fetchPosts={fetchPosts} />}
            {showAddProject && <AddProjectConponent setShowAddProject={setShowAddProject} fetchProjects={fetchProjects} />}
            {setBanner && <BannerSettingConponent setSetBanner={setSetBanner} handleDeleteAllImg={handleDeleteAllImg} imgsBannerf={imgsBannerf} />}

            <div className='bottom'>
                <div className='Tab'>
                    {showProject ? (<div className='leftTab'>
                        <div><h2>Quản lý dự án</h2> <span>Tổng số dự án - {projects.length}</span></div>
                    </div>)
                        : (<div className='leftTab'>
                            <div><h2>Quản lý bài viết</h2> <span>Tổng số bài viết - {posts.length}</span></div>
                        </div>)
                    }
                    <div className='switchTable'>
                        <div className='btn' onClick={() => setShowProject(false)} style={{ backgroundColor: !showProject ? "#cdcdcd" : "#fff" }}>
                            <img src={newsPaperIcon} alt="" />
                        </div>
                        <div className='btn' onClick={() => setShowProject(true)} style={{ backgroundColor: showProject ? "#cdcdcd" : "#fff" }}>
                            <img src={projectIcon} alt="" />
                        </div>
                    </div>
                </div>

                {loading && (<h3>Đang tải dữ liệu......</h3>)}
                {!showProject ? (<table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgb(254 220 160)' }}>
                            <th>STT</th>
                            <th>Banner</th>
                            <th>Tiêu đề</th>
                            <th>Thời gian tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts ? posts.map((post, i) => (
                            <tr className='rowTable' key={post._id} style={{ backgroundColor: i % 2 == 0 ? '#e6e6e6' : '#fff' }}>
                                <td>{i + 1}</td>

                                {editModePost == i ?
                                    (<td colSpan={3}>{<AddPostConponent handleDeleteAllImg={handleDeleteAllImg} setEditModePost={setEditModePost} fetchPosts={fetchPosts} data={post} />}</td>)
                                    :
                                    (
                                        <>
                                            <td>
                                                <img src={post.imgTitle} alt={post.title} style={{ width: "100px", objectFit: "cover" }} />
                                            </td>
                                            <td>{post.title}</td>
                                            <td>
                                                {new Date(post.createdAt).toLocaleString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false
                                                })}
                                            </td>
                                        </>
                                    )
                                }
                                <td className='tdAction'
                                    onClick={() => {
                                        if (i === editModePost) { setEditModePost(null) } else {
                                            // setShowAddProject(false)
                                            setEditModePost(i)
                                        }
                                    }
                                    }>
                                    {editModePost == i ? (<img className='btnAction' src={removeIcon} />) : (<img className='btnAction' src={editIcon} />)}
                                </td>
                                <td className='tdAction' onClick={() => handleDeletePost(i, post._id)}><img className='btnAction' src={deleteIcon} alt="" /></td>
                            </tr>
                        )) : <tr><td>Không có dữ liệu</td></tr>}
                    </tbody>
                </table>) :
                    (<table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: '#cef0ff' }}>
                                <th>STT</th>
                                <th>Banner</th>
                                <th>Tên</th>
                                <th>Chủ đầu tư</th>
                                <th>Giá</th>
                                <th>Địa điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects ? projects.map((project, i) => (
                                <tr className='rowTable' key={i} style={{ backgroundColor: i % 2 == 0 ? '#e6e6e6' : '#fff' }}>
                                    <td>{i + 1}</td>
                                    {editModeProject == i ? (<td colSpan={5}>{<AddProjectConponent handleDeleteAllImg={handleDeleteAllImg} setEditModeProject={setEditModeProject} fetchProjects={fetchProjects} data={project} />}</td>)
                                        :
                                        (
                                            <>
                                                <td>
                                                    <img src={project?.imgs[0]?.link} style={{ width: "100px", objectFit: "cover" }} />
                                                </td>
                                                <td>{project.name}</td>
                                                <td>{project.investor}</td>
                                                <td>{priceDisplay(project.totalCost)}</td>
                                                <td>{project.location}</td>
                                            </>
                                        )
                                    }
                                    <td className='tdAction'
                                        onClick={() => {
                                            if (i === editModeProject) { setEditModeProject(null) } else {
                                                setShowAddProject(false)
                                                setEditModeProject(i)
                                                console.log('data', project)
                                            }
                                        }
                                        }>
                                        {editModeProject == i ? (<img className='btnAction' src={removeIcon} />) : (<img className='btnAction' src={editIcon} />)}
                                    </td>
                                    <td className='tdAction' onClick={() => handleDeleteProject(i, project._id)}><img className='btnAction' src={deleteIcon} alt="" /></td>
                                </tr>
                            )) : <h1>Không có dữ liệu</h1>}
                        </tbody>
                    </table>)}
            </div>
            <div style={{ marginBottom: '1000px' }}></div>
            {loading && <LoadingComponent />}
        </div>
    )
}

export default AdminPage