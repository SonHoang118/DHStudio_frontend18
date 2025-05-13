import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import SliderComponent from '../../components/SliderComponent'
import TextAnimation from '../../utils/TextAnimation'

import logo from '../../assets/images/logo.jpg'
import bg1 from '../../assets/images/bg1.jpg'

import tencongty from '../../assets/images/id-card.png'
import diachi from '../../assets/images/pin.png'
import sdt from '../../assets/images/telephone.png'
import email from '../../assets/images/mail.png'
import website from '../../assets/images/world-wide-web.png'

import noithat from '../../assets/images/livingroom.png'
import thietke from '../../assets/images/sketch.png'
import lapdat from '../../assets/images/wrench.png'
import xuatkhau from '../../assets/images/export.png'
import axios from 'axios'
import LoadingComponent from '../../components/LoadingConponent'
import { Link, useNavigate } from 'react-router-dom'

import ReactDragScroll from 'react-indiana-drag-scroll'
import { slugify } from '../../utils/stringToSlugifi'

const HomePage = () => {
    const fetchProjects = async () => {
        setLoading(true);
        try {
            await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/getAllProject`)
                .then(async resProjects => {
                    setProjects(resProjects.data.projects);
                    await axios.get(`${process.env.REACT_APP_BASE_URL_BACKEND}/get-all-type-product`)
                        .then(resStyle => {
                            setStyle(resStyle.data?.types)
                        })

                });
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


    const handleClickPost = (slugify) => {
        navigate(`/bai-viet/${slugify}`)
    }
    const handleClickProject = (slugify) => {
        navigate(`/du-an/${slugify}`)
    }

    const gioiThieuRef = useRef(null);
    const linhVucRef = useRef(null);
    const baiVietRef = useRef(null);
    const duAnRef = useRef(null);
    const lienHeRef = useRef(null);

    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);

    const [style, setStyle] = useState([])
    const [styleSelect, setStyleSelect] = useState([])

    const [imgsBannerf, setImgsBannerf] = useState([])
    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState('')

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProjects = projects.filter(p => {
        const matchesType = styleSelect.length == 0 || styleSelect.every(t => t.id_projects_list?.includes(p._id));
        const matchesSearch = p.slugify.includes(slugify(search));
        return matchesType && matchesSearch;
    });

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [styleSelect, search]);




    const itemsPerPagePost = 6;
    const [currentPagePost, setCurrentPagePost] = useState(1);

    const totalPagesPost = Math.ceil(posts.length / itemsPerPagePost);

    const handlePageChangePost = (page) => {
        setCurrentPagePost(page);
    };

    const startIndexPost = (currentPagePost - 1) * itemsPerPagePost;
    const selectedPost = posts.slice(startIndexPost, startIndexPost + itemsPerPagePost);




    const navigate = useNavigate()

    const handleSelectStyle = (item) => {
        setStyleSelect(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item) // remove if exists
                : [...prev, item]              // add if not exists
        );
    };


    const [viewGridMode, setViewGridMode] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'gioi-thieu' && gioiThieuRef.current) {
                gioiThieuRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            if (hash === 'lien-he' && lienHeRef.current) {
                lienHeRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            if (hash === 'du-an' && duAnRef.current) {
                duAnRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            if (hash === 'bai-viet' && baiVietRef.current) {
                baiVietRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            if (hash === 'linh-vuc' && linhVucRef.current) {
                linhVucRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 250);
    }, []);


    return (
        <div>
            <SliderComponent
                images={[
                    ...imgsBannerf.map(img => img.link)
                ]}
                // style={{
                //     width: '100%',
                //     maxHeight: '550px',
                //     marginTop: '60px',
                //     // objectFit: 'containt'
                // }}
                className={'sliderConponent'}
            />
            <div className='company'>
                <span className='service'>DHS - Thiết kế và thi công kiến trúc</span><b>Xin chào</b>
            </div>
            <section ref={gioiThieuRef} id="gioi-thieu">
            </section>
            <div className='topImg'>
                <img src={bg1} className='bgc' />
                <div className='wrapper'>
                    <div className='left'>
                        <span className='title' style={{ animation: 'showText 1s ease-in 1.5s forwards' }}>Lời giới thiệu</span>
                        <span className='line' style={{ animation: 'showLine 1s ease-in-out 3.5s forwards' }}></span>
                        <div className='sologanDiv'>
                            <TextAnimation text='Chất lượng' className='sologan' delayStart={3} />
                            <TextAnimation text='là NỀN MÓNG' className='sologan' delayStart={3.8} />
                            <TextAnimation text='Sáng tạo' className='sologan' delayStart={4.9} />
                            <TextAnimation text='là GIÁ TRỊ' className='sologan' delayStart={5.7} />
                        </div>
                        <img className='logoAbout' src={logo} style={{ animation: 'showText 1s ease-in-out 7s forwards' }} />

                    </div>
                    <div className='content'>
                        <span style={{ animation: 'showText 1s ease-in-out 2.3s forwards' }}>DHS - Thiết kế và thi công kiến trúc là đơn vị chuyên sản xuất & tư vấn, thiết kế thi công nội thất. Thiết kế thi công các công trình biệt thự, nhà phố, căn hộ, chung cư và đặc biệt thiết kế trang trí văn phòng, showroom, nhà hàng, khách sạn...</span>
                        <span style={{ animation: 'showText 1s ease-in-out 2.6s forwards' }}>DHS tập trung với thế mạnh là đơn vị sản xuất nội thất hàng đầu cho thi trường trong nước và xuất khẩu cho các Đối tác, Khách hàng lớn ngoài nước .DHS luôn lấy tiêu chí thẩm mỹ, hiệu quả và đúng tiến độ làm phương châm làm việc..</span>
                        <span style={{ animation: 'showText 1s ease-in-out 3.1s forwards' }}>Công ty với đội ngũ kỹ sư giỏi và giàu kinh nghiệm, thợ thi công tay nghề cao, nên chúng tôi tự tin đem đến cho khách hàng những sản phẩm tốt nhất. DHS không chỉ thiết kế đơn thuần mà đặc biệt chú trọng các giải pháp kiến trúc, nội thất kết hợp với phong thủy nhăm giải quyết những vấn đề về không gian sống của bạn.</span>
                    </div>
                    <div className='sologanDivMobile'>
                        <TextAnimation text='Chất lượng là NỀN MÓNG' className='sologan' delayStart={3} />
                        <TextAnimation text='Sáng tạo là GIÁ TRỊ' className='sologan' delayStart={4.9} />
                    </div>
                    <img className='logoAboutMobile' src={logo} style={{ animation: 'showText 1s ease-in-out 7s forwards' }} />
                </div>
            </div>

            <div className='information'>
                <div className='inforText'>
                    <ul className='inforList'>
                        <div className='infor'>
                            <div>
                                <img src={tencongty} />
                            </div>
                            <p>
                                <b>Tên công ty: </b>
                                <span>DHStudio tư vấn và thiết kế kiến trúc</span>
                            </p>
                        </div>

                        <div className='infor'>
                            <div>
                                <img src={diachi} />
                            </div>
                            <p>
                                <b>Địa chỉ trụ sở: </b>
                                <span>17 Đông Hội, Thôn Trung Thôn, Đông Anh, Hà Nội, Việt Nam</span>
                            </p>
                        </div>

                        <div className='infor'>
                            <div>
                                <img src={sdt} />
                            </div>
                            <p>
                                <b>Số điện thoại: </b>
                                <span>0356322298, 0988757265</span>
                            </p>
                        </div>

                        <div className='infor'>
                            <div>
                                <img src={email} />
                            </div>
                            <p>
                                <b>Email: </b>
                                <span>dhstudio.architecure@gmail.com</span>
                            </p>
                        </div>

                        <div className='infor'>
                            <div>
                                <img src={website} />
                            </div>
                            <p>
                                <b>Website: </b>
                                <span>https://www.dhstudio.com.vn</span>
                            </p>
                        </div>
                    </ul>
                    <div style={{ marginTop: '100px' }}></div>
                    <ul className='bottom'>
                        <div>
                            <b>Vốn điều lệ: </b>
                            <span>1.000.000.000 (1 tỷ đồng)</span>
                        </div>
                        <div>
                            <b>Mã số thuế: </b>
                            <span>0314555248</span>
                        </div>
                        <div>
                            <b>Đại diện pháp luật: </b>
                            <span>Hoàng Văn Thái Sơn</span>
                        </div>
                    </ul>
                </div>
                <div className="map-responsive">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d24659.108336158948!2d105.87008461297685!3d21.09269128264674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDA1JzQxLjkiTiAxMDXCsDUyJzAwLjkiRQ!5e0!3m2!1svi!2s!4v1723187855111!5m2!1svi!2s"
                        width="600"
                        height="600"
                        style={{ border: '3px solid #c5c5c5', outline: '0' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="responsive-map"
                    ></iframe>
                </div>
            </div>

            <section ref={linhVucRef} id="linh-vuc">
            </section>

            <div className='bottomImg'>
                <ul className='list'>
                    <div>
                        <img src={noithat} />
                        <span>Sản xuất đồ gô nội thất đa dạng về phong cách tân cô điến, cố điến, hiện đại như bàn ghế, giường tủ, kệ tỉ vi...</span>
                        <span>Sản xuất đồ gô nội thất </span>
                    </div>
                    <div>
                        <img src={thietke} />
                        <span>Tư vẫn thiết kế nội thất: Dịch vụ khảo sát, tư vẫn thiết kế nội thất, bố cục layout trên (CAD) mô hình (3D max), lên dự toán tổng thể nội thất</span>
                        <span>Tư vẫn thiết kế nội thất</span>
                    </div>
                    <div>
                        <img src={lapdat} />
                        <span>Thi công lắp đặt hoàn thiện ngoai nội thất cho các Công Trình Nhà Phố, Biệt Thư, Nhà Hàng Khách Sạn, Resort...</span>
                        <span>Thi công lắp đặt</span>
                    </div>
                    <div>
                        <img src={xuatkhau} />
                        <span>Sản xuất đô gô xuất khẩu ra thị trường Châu Âu</span>
                        <span>Sản xuất xuất khẩu</span>
                    </div>
                </ul>
                <span className='service'><b>Dịch vụ</b> của chúng tôi </span>
            </div>

            <section ref={baiVietRef} id="bai-viet">
            </section>
            <div className='wrapper_posts'>
                <div className='posts'>
                    <h3 className='postText'>Bài viết</h3>
                    <div className='container'>
                        {selectedPost.map((post, i) => (
                            <div className='post' key={post._id} onClick={() => handleClickPost(post.slugify)}>
                                <Link href={post.link}>
                                    <div className='post_img'><img src={post.imgTitle} /></div>
                                    <h3 className='post_title'>{post.title}</h3>
                                    <span className='post_contentPreview'>{post.contentPreview}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {posts.length > 6 && <div className="pagination">
                        <button className='paginationBtn btnPost' style={{ opacity: currentPagePost === 1 ? 0 : 1 }}
                            onClick={() => handlePageChangePost(currentPagePost - 1)}><i className="fa-solid fa-angle-left"></i></button>
                        <div className='btnNumber'>
                            {Array.from({ length: totalPagesPost }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChangePost(i + 1)}
                                    className={`paginationBtn btnPost ${currentPagePost === i + 1 ? "activePagination" : ""
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button className='paginationBtn btnPost' style={{ opacity: currentPagePost === totalPagesPost ? 0 : 1 }}
                            onClick={() => handlePageChangePost(currentPagePost + 1)}><i className="fa-solid fa-angle-right"></i></button>
                    </div>}
                </div>
            </div>

            <section ref={duAnRef} id="du-an">
            </section>
            <div className='projects'>
                <div className='container'>
                    <span className='title'><b>Dự án</b> của chúng tôi </span>
                    <div className='topProjetcs'>
                        {style && <div className='style_list_select'>
                            <ReactDragScroll className='styles_show'>
                                {style.map((type, i) => {
                                    if (styleSelect.includes(type)) return
                                    return (
                                        <div className='styles' key={i}>
                                            <span className='item' style={{ color: '#fff' }} onClick={() => handleSelectStyle(type)} >{type.name}</span>
                                        </div>
                                    )
                                })}
                            </ReactDragScroll>
                        </div>}
                        <div className='bottom_p'>
                            <div className='search_group'>
                                <input type="text" placeholder='Tìm kiếm ...' className='input_search' value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button>Tìm kiếm</button>
                            </div>
                            <div className='sortBtn'>
                                <button className={viewGridMode ? 'showModeActive' : ''} onClick={() => setViewGridMode(true)}><i className="fa-solid fa-border-all"></i></button>
                                <button className={!viewGridMode ? 'showModeActive' : ''} onClick={() => setViewGridMode(false)}><i className="fa-solid fa-list"></i></button>
                            </div>
                        </div>
                        {styleSelect.length != 0 && <ReactDragScroll className='styles_selected'>
                            {styleSelect.map((t, i) => (<div className='active' key={i}><span onClick={() => handleSelectStyle(t)} className='itemSelect'>{t.name}<i style={{ marginLeft: '10px' }} className='fa-solid fa-xmark' /></span></div>))}
                        </ReactDragScroll>}
                    </div>


                    {viewGridMode ? (<div className='grid'>
                        {paginatedProjects.length != 0 ? paginatedProjects.map(project => {
                            return (
                                <Link style={{ animation: 'showCard .1s ease-in-out forwards' }} to={`/du-an/${project.slugify}`} className='project' key={project._id} onClick={() => handleClickProject(project.slugify)}>
                                    <div className='project_img'><img style={{}} src={project.imgs[0].link} /></div>
                                    <div className='project_bottom'>
                                        <h3>{project.name}</h3>
                                        <div className='order_info'>
                                            <span>Chủ đầu tư: {project.investor || '--'}</span>
                                            <span>Diện tích: {project.area || '--'}</span>
                                            <span>Địa điểm: {project.location || '--'}</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        }
                        ) : <h2 className='noProject'>Không có dự án</h2>}
                    </div>) :
                        (<div className='list_project'>
                            {paginatedProjects.length != 0 ? paginatedProjects.map((project, i) => {
                                return (
                                    <Link style={{ animation: `showCard2 .1s ease-in-out forwards ${i * 0.02}s` }} to={`/du-an/${project.slugify}`} className='project_lv' key={project._id} onClick={() => handleClickProject(project.slugify)}>
                                        <div className='project_img_lv'><img style={{}} src={project.imgs[0].link} /></div>
                                        <div className='project_bottom_lv'>
                                            <h3>{project.name}</h3>
                                            <div className='order_info_lv'>
                                                <div className='other_info_left'>
                                                    <span>Chủ đầu tư: {project.investor || '--'}</span>
                                                    <span>Diện tích: {project.area || '--'}</span>
                                                </div>
                                                <div className='other_info_right'>
                                                    <span>Địa điểm: {project.location || '--'}</span>
                                                    <span>{project.date.split("-")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                            ) : <h2 className='noProject'>Không có dự án</h2>}
                        </div>)}
                    {filteredProjects.length > 6 && <div className="pagination">
                        <button className='paginationBtn' style={{ opacity: currentPage === 1 ? 0 : 1 }}
                            onClick={() => handlePageChange(currentPage - 1)}><i className="fa-solid fa-angle-left"></i></button>
                        <div className='btnNumber'>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`paginationBtn ${currentPage === i + 1 ? "activePagination" : ""
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button className='paginationBtn' style={{ opacity: currentPage === totalPages ? 0 : 1 }}
                            onClick={() => handlePageChange(currentPage + 1)}><i className="fa-solid fa-angle-right"></i></button>
                    </div>}
                </div>

            </div>

            <section ref={lienHeRef} id="lien-he">
            </section>
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

            {loading && <LoadingComponent />}

        </div>
    )
}

export default HomePage
