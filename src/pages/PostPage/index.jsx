import React, { useEffect, useState } from 'react'

import draftToHtml from 'draftjs-to-html';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingConponent';
import axios from 'axios';
import './index.scss'
import { formatVietnameseDate } from '../../utils/formatVietnameseDate ';

import homeIcon from '../../assets/images/004-home.png'
import heartIcon from '../../assets/images/001-heart.png'
import printIcon from '../../assets/images/002-printer.png'
import shareIcon from '../../assets/images/003-share.png'
import NotFoundPage from '../NotFoundPage';


const PostPage = () => {
    const location = useLocation();
    const [post, setPost] = useState()

    const [othorPosts, setOtherPosts] = useState([])

    const [projects, setProjects] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const { slugify } = useParams();

    const handleGetDetailPost = async () => {
        setIsLoading(true)
        await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getDetailPost/${slugify}`)
            .then(async resDetail => {
                setPost(resDetail?.data?.post)
                await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllProject`)
                    .then(async resProjects => {
                        setProjects(resProjects?.data?.projects)
                        await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllPosts`)
                            .then(async resPosts => {
                                setOtherPosts(resPosts?.data?.posts)
                                setIsLoading(false)
                            })
                    })
            })
    }
    useEffect(() => {
        console.log('slugify', slugify)
        console.log('state', location.state)
        handleGetDetailPost()

    }, [slugify])

    const navigate = useNavigate()

    const handleClickPost = (slugify) => {
        navigate(`/bai-viet/${slugify}`)
    }
    const handleClickProject = (slugify) => {
        navigate(`/du-an/${slugify}`)
    }

    const getRandomProjects = (projects, count = 6) => {
        const shuffled = [...projects].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomProjects = getRandomProjects(projects, 6);

    if (post || !slugify === 'undefined') {
        return (
            <div className="post_page">
                <div className='banner'>
                    <img src={post?.imgTitle} />
                    <h2>{post?.title}</h2>
                </div>
                <div className="post_container">
                    <div className='interaction_post'>
                        <div className='item'><img src={homeIcon} /></div>
                        <div className='item'><img src={heartIcon} /></div>
                        <div className='item'><img src={printIcon} /></div>
                        <div className='item'><img src={shareIcon} /></div>

                    </div>
                    <div className="post_content">
                        {/* <p className='createdAt'>{post?.createdAt && formatVietnameseDate(post?.createdAt)}</p> */}
                        {post?.content && <div className='content_wrapper' dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(post?.content)) }} />}
                    </div>
                    <div className='other_post'>
                        <h3>Mời bạn đọc các bài viết khác</h3>
                        <div className='first_post'>
                            {othorPosts && <div>
                                <img src={othorPosts[0]?.imgTitle} />
                                <h3>{othorPosts[0]?.title}</h3>
                            </div>}
                        </div>
                        <div className='another_post'>
                            {othorPosts?.map((post, i) => {
                                if (i == 0 || i > 4) return
                                return (
                                    <div className='aPost' key={i} onClick={() => handleClickPost(post.slugify)}>
                                        <h5>{post.title}</h5>
                                        <img src={post.imgTitle} />
                                    </div>
                                )
                            })}
                        </div>
                        <h3 className='showMore' onClick={() => navigate(`/#bai-viet`)}>Xem thêm</h3>
                    </div>
                </div>
                <div className='interaction_post_Mobile'>
                    <div className='item'><img src={homeIcon} /></div>
                    <div className='item'><img src={heartIcon} /></div>
                    <div className='item'><img src={printIcon} /></div>
                    <div className='item'><img src={shareIcon} /></div>

                </div>
                {othorPosts && <div className='posts'>
                    <h3 className='postText'>Mời bạn đọc các bài viết</h3>
                    <div className='container'>
                        {othorPosts.map((post, i) => {
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

                <div className='projects'>
                    <div className='container'>
                        <span className='title'>Tham khảo các dự án của chúng tôi </span>
                        <div className='grid'>
                            {randomProjects.map((project, i) => (
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
                            ))}
                        </div>
                        <h3 className='showMore' onClick={() => navigate(`/#du-an`)} style={{ marginTop: '100px' }}>Xem tất cả</h3>
                    </div>

                </div>

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

                {isLoading && <LoadingComponent />}
            </div>
        )
    }
    else {
        return (<NotFoundPage />)
    }
}

export default PostPage