import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingConponent';
import axios from 'axios';
import './index.scss'

import SliderComponent from '../../components/SliderComponent'
import NotFoundPage from '../NotFoundPage';


const ProjectPage = () => {
    const [posts, setPosts] = useState()

    const [otherProjects, setOtherProjects] = useState([])

    const [project, setProject] = useState([])

    const [style, setStyle] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const { slugify } = useParams();

    const handleGetData = async () => {
        setIsLoading(true)
        await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getDetailProject/${slugify}`)
            .then(async resDetail => {
                setProject(resDetail?.data?.project)
                await axios.post(`${process.env.REACT_APP_BASE_URL_BACKEND}/get-many-detail-type-product`, { idTypes: resDetail.data.project?.style })
                    .then(async resStyle => {
                        setStyle(resStyle.data)
                        await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllProject`)
                            .then(async resProjects => {
                                setOtherProjects(resProjects?.data?.projects)
                                await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllPosts`)
                                    .then(async resPosts => {
                                        setPosts(resPosts?.data?.posts)
                                        setIsLoading(false)
                                    })
                            })
                    })

            })
    }
    useEffect(() => {
        handleGetData()
    }, [slugify])

    const navigate = useNavigate()

    const handleClickPost = (slugify) => {
        navigate(`/bai-viet/${slugify}`)
    }
    const handleClickProject = (slugify) => {
        navigate(`/du-an/${slugify}`)
    }


    if (project || !slugify === 'undefined') {
        return (
            <div className="project_page">
                <div className='banner'>
                    {project?.imgs && <SliderComponent
                        images={[
                            ...project?.imgs?.map(img => img.link)
                        ]}
                        style={{
                            width: '100%',
                            height: '400px',
                            filter: 'brightness(.3)',
                            objectFit: 'cover',
                            marginTop: 0
                        }}
                        noDot={true}
                    />}
                    <div className='breadcrumb'>
                        <span><i className='fa-solid fa-house' /> trang chủ</span>
                        <i className='fa-solid fa-angle-right' />
                        <span>{slugify}</span>
                    </div>
                </div>
                <div className="post_container">
                    <div className="post_content">
                        <h2 className='post_name'>{project?.name}</h2>
                        <div className='project_info'>
                            <h2 className='heading2'>Thông tin dự án</h2>
                            {project?.location && <span>Địa điểm: <span className='value'>{project?.location}</span></span>}
                            {project?.investor && <span>Chủ đầu tư: <span className='value'>{project?.investor}</span></span>}
                            {project?.are && <span>Diện tích: <span className='value'>{project?.are}</span></span>}
                            {project?.style?.length != 0 && <span>Phong cách: <span className='value'>{style?.map(s => (<span key={s._id}> {s.name} </span>))}</span></span>}
                            {project?.date && <span>Thời gian khởi công: <span className='value'>{project?.date}</span></span>}
                            {project?.decs && <p>{project.decs}</p>}
                            {project.imgs && <div className='project_imgs'>
                                <h2 className='heading2'>Hình ảnh dự án</h2>
                                <div className='imgs_list'>
                                    {project.imgs.map((img, i) => (
                                        <img src={img.link} key={i} />
                                    ))}
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className='other_projects'>
                        <h3>Mời bạn xem dự án viết khác</h3>
                        {otherProjects.map((p, i) => {
                            if (p._id === project._id || i > 2) return
                            return (
                                <div className='project' key={p._id} onClick={() => handleClickProject(p.slugify)}>
                                    <div className='project_img'><img style={{}} src={p.imgs[0].link} /></div>
                                    <div className='project_bottom'>
                                        <h3>{p.name}</h3>
                                        <div className='order_info'>
                                            <span>Chủ đầu tư: {p.investor || '--'}</span>
                                            <span>Diện tích: {p.area || '--'}</span>
                                            <span>Địa điểm: {p.location || '--'}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <h3 className='showMore' onClick={() => navigate(`/#du-an`)} >Xem thêm</h3>
                    </div>

                </div>

                <div className='projects'>
                    <div className='container'>
                        <span className='title'>Tham khảo các dự án của chúng tôi </span>
                        <div className='grid'>
                            {otherProjects.map((project, i) => {
                            if (i>5) return
                            return(
                                <div className='project' key={project._id} onClick={() => handleClickProject(project.slugify)}>
                                    <div className='project_img'><img style={{}} src={project.imgs[0].link} /></div>
                                    <div className='project_bottom'>
                                        <h3>{project.name}</h3>
                                        <div className='order_info'>
                                            <span>Chủ đầu tư: {project.investor || '--'}</span>
                                            <span>Diện tích: {project.area || '--'}</span>
                                            <span>Địa điểm: {project.location || '--'}</span>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                        <h3 className='showMore' onClick={() => navigate(`/#du-an`)} style={{ marginTop: '100px' }}>Xem tất cả</h3>
                    </div>

                </div>



                <div className='bgcContactForm'>
                    <div className='contactform'>
                        <div className='contact-wrapper'>
                            <div className='contact-left'>
                                <h3>Đăng ký tư vấn miễn phí</h3>
                                <div className='input-group'>
                                    <label htmlFor='name'>Họ và tên</label>
                                    <input id='name' />
                                </div>
                                <div className='input-group'>
                                    <label htmlFor='phone'>Số điện thoại</label>
                                    <input id='phone' />
                                </div>
                                <div className='input-group'>
                                    <label htmlFor='email'>Email</label>
                                    <input id='email' />
                                </div>
                                <div className='input-group'>
                                    <label htmlFor='note'>Lời nhắn</label>
                                    <textarea />
                                </div>
                                <button>Gửi</button>
                            </div>
                            <div className='contact-right'>
                                <img src='https://media.idownloadblog.com/wp-content/uploads/2021/08/achitecture-wallpaper-iPhone-idownloadblog-pierre-chatel-innocenti.jpg' />
                            </div>
                        </div>
                    </div>
                </div>
                {posts && <div className='posts'>
                    <h3 className='postText'>Mời bạn đọc các bài viết khác</h3>
                    <div className='container'>
                        {posts.map((post, i) => {
                            if (i > 5) return
                            return (
                                <div className='post' key={post._id} onClick={() => handleClickPost(post.slugify)}>
                                    <a href={post.link}>
                                        <div className='post_img'><img src={post.imgTitle} /></div>
                                        <h3 className='post_title'>{post.title}</h3>
                                        <span className='post_contentPreview'>{post.contentPreview}</span>
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                    <h3 className='showMore' onClick={() => navigate(`/#bai-viet`)}>Xem tất cả bài viết</h3>
                </div>}
                {isLoading && <LoadingComponent />}
            </div>
        )
    }
    else return (<NotFoundPage />)
}

export default ProjectPage