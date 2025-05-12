import React, { useRef, useState } from 'react'
import './index.scss'
import logoImg from '../../assets/images/logo.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HeaderComponent = () => {

    const [showMenu, setShowMenu] = useState(false)

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

    const closeRef = useRef()
    const overlayRef = useRef()
    const menuRef = useRef()
    const onClickClose = (e) => {
        if (!closeRef || !overlayRef || !menuRef) return
        e.stopPropagation()
        closeRef.current.classList.add('hideCloseAnimation');
        overlayRef.current.classList.add('hideOverlayAnimation');
        menuRef.current.classList.add('hideMenuAnimation');
        setTimeout(() => {
            setShowMenu(false)
        }, 200)
    }
    return (
        <div className='header'>
            <div className='header_content'>

                <div className='homeLink'>
                    <a href='/' className='name'>
                        <span>DHStudio</span>
                        <img src={logoImg} />
                    </a>
                </div>
                <div className='navList'>
                    <li onClick={() => handleNavClick('gioi-thieu')}>Giới thiệu</li>
                    <li onClick={() => handleNavClick('linh-vuc')}>Lĩnh vực</li>
                    <li onClick={() => handleNavClick('bai-viet')}>Bài viết</li>
                    <li onClick={() => handleNavClick('du-an')}>Dự án</li>
                    <li onClick={() => handleNavClick('lien-he')}>Liên hệ</li>
                    <div className='phoneCall'><i className="fa-solid fa-phone"></i> 0356322298</div>
                </div>

                <div className='navMobile' onClick={() => setShowMenu(true)}>
                    <i className="fa-solid fa-bars"></i>
                </div>

            </div>

            {showMenu && <div className='menuMobile' onClick={(e) => onClickClose(e)} ref={overlayRef}>
                <div className='close_menu_mobile' onClick={(e) => onClickClose(e)} ref={closeRef}><i className="fa-solid fa-xmark"></i></div>

                <nav className='header_navbar_mobile' onClick={e => e.stopPropagation()} ref={menuRef}>
                    <Link to="/" className='logo_menu_mobile'><img src={logoImg} /></Link>
                    <ul className='nav_list_mobile'>
                        <li className='nav_item_mobile' onClick={(e) => {
                            handleNavClick('gioi-thieu')
                            onClickClose(e)
                            }}>Giới thiệu</li>
                        <li className='nav_item_mobile' onClick={(e) => {
                            handleNavClick('linh-vuc')
                            onClickClose(e)
                            }}>Lĩnh vực</li>
                        <li className='nav_item_mobile' onClick={(e) => {
                            handleNavClick('bai-viet')
                            onClickClose(e)
                            }}>Bài viết</li>
                        <li className='nav_item_mobile' onClick={(e) => {
                            handleNavClick('du-an')
                            onClickClose(e)
                            }}>Dự án</li>
                        <li className='nav_item_mobile' onClick={(e) => {
                            handleNavClick('lien-he')
                            onClickClose(e)
                            }}>Liên hệ</li>
                        {/* <div className='phoneCall'><i className="fa-solid fa-phone"></i> 0356322298</div> */}

                    </ul>
                </nav>

            </div>}
        </div>
    )
}

export default HeaderComponent