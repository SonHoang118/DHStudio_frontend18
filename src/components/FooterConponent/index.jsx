import React, { memo } from 'react'
import styleModule from './index.module.scss'
import emailIcon from '../../assets/images/email_icon.png'
import phoneIcon from '../../assets/images/phone_icon.png'
import zaloIcon from '../../assets/images/zalo_icon.png'
import mesengerIcon from '../../assets/images/messenger_icon.png'

import BG from '../../assets/images/bgcFooter.jpg'
import { useLocation, useNavigate } from 'react-router-dom'
// import '../../style/myGrid.css'

const FooterConponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavClick = (sectionId) => {
        if (location.pathname === '/') {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                console.log('aaaa')
            }
        } else {
            navigate(`/#${sectionId}`);
        }
    };
    return (
        <div className={`${styleModule.footer}`}>
            <div className={`${styleModule.footer_top}`}>
                <img className={styleModule.bg} src={BG} />
                {/* <div className={`grid wide`}>
                    <div className={`row`}>
                        <div className={`col l-6 c-12 m-12`}>

                            <div className={`${styleModule.footer_left}`}>
                                <div className={`${styleModule.footer_infor_contact}`}>Thông tin liên hệ
                                    <ul className={`${styleModule.footer_infor_contact_list}`}>
                                        <li>Địa chỉ: Khu tập thể H10, Đường Trường Chinh, Phường Đình, Đống Đa, Hà Nội</li>
                                        <li>Số điện thoại: 0383346631, 0971833093</li>
                                        <li>Email: thutrang1105@gmail.com</li>
                                    </ul>
                                    <div className={`${styleModule.footer_category_and_contact}`}>
                                        <div className={`${styleModule.footer_category}`}>Danh mục
                                            <ul className={`${styleModule.footer_category_list}`}>
                                                <li><a href="#about">Giới thiệu</a></li>
                                                <li><a href="#service">Lĩnh vực</a></li>
                                                <li><a href="#contact">Liên hệ</a></li>
                                                <li><a href="#project">Dự án</a></li>
                                            </ul>
                                        </div>

                                        <div className={`${styleModule.footer_contact}`}>Liện hệ với chúng tôi
                                            <ul className={`${styleModule.footer_contact_list}`}>
                                                <a href='#contactForm'><div className={`${styleModule.footer_contact_item}`} id="item_email" style={{ backgroundImage: `url(${emailIcon})` }}></div></a>

                                                <a className={`${styleModule.footer_contact_item}`} id="item_messenger" href="https://m.me/104988175154682" target="_blank" style={{ backgroundImage: `url(${mesengerIcon})` }}></a>

                                                <a className={`${styleModule.footer_contact_item}`} id="item_zalo" href="https://zalo.me/0971833093" target="_blank" style={{ backgroundImage: `url(${zaloIcon})` }}></a>

                                                <a className={`${styleModule.footer_contact_item}`} id="item_phone" href="tel: +0971833093" style={{ backgroundImage: `url(${phoneIcon})` }}></a>
                                            </ul>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className={styleModule.wrapper}>

                    <div className={styleModule.contactInfo}>
                        <h2>Thông tin liên hệ</h2>
                        <div><b>Công ty: </b><span>DHStudio tư vấn và thiết kế kiến trúc</span></div>
                        <div><b>Địa chỉ: </b><span>7 Đông Hội, Thôn Trung Thôn, Đông Anh, Hà Nội, Việt Nam</span></div>
                        <div><b>Hotline: </b><span>0983239596</span></div>
                        <div><b>Email: </b><span>dhs.studio.arch@gmail.com</span></div>
                        <div><b>Website: </b><span>https://www.dhstudio.com.vn</span></div>
                    </div>
                    <div className={styleModule.aboutUs}>
                        <h2>Về chúng tôi</h2>
                        <div className={styleModule.serviceList}>
                            <div className={styleModule.list}>

                                <li onClick={() => handleNavClick('gioi-thieu')}>Giới thiệu</li>
                                <li onClick={() => handleNavClick('linh-vuc')}>Lĩnh vực</li>
                                <li onClick={() => handleNavClick('bai-viet')}>Bài viết</li>
                                <li onClick={() => handleNavClick('du-an')}>Dự án</li>
                                <li onClick={() => handleNavClick('lien-he')}>Liên hệ</li>
                            </div>
                        </div>

                    </div>
                    <div className={styleModule.connectUs}>
                        <h2>Kết nối với chúng tôi</h2>
                        <ul className={`${styleModule.footer_contact_list}`}>
                            <li onClick={() => handleNavClick('lien-he')}><div className={`${styleModule.footer_contact_item}`} id="item_email" style={{ backgroundImage: `url(${emailIcon})` }}></div></li>
                            <a className={`${styleModule.footer_contact_item}`} id="item_messenger" href="https://m.me/104988175154682" target="_blank" style={{ backgroundImage: `url(${mesengerIcon})` }}></a>
                            <a className={`${styleModule.footer_contact_item}`} id="item_zalo" href="https://zalo.me/0971833093" target="_blank" style={{ backgroundImage: `url(${zaloIcon})` }}></a>
                            <a className={`${styleModule.footer_contact_item}`} id="item_phone" href="tel: +0983239596" style={{ backgroundImage: `url(${phoneIcon})` }}></a>
                        </ul>
                    </div>

                </div>

            </div>
            <div className={`${styleModule.footer_bottom}`}>
                Copyright 2023 ©
            </div>
        </div>
    )
}

export default memo(FooterConponent)
