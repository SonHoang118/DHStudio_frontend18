import React, { useEffect, useState } from 'react'
import styleModule from './index.module.scss'
import img404 from '../../assets/images/404img.jpg'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    
    // Cleanup khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={styleModule.not_found_page}>
      <div className={styleModule.not_found_page_top}>
          <img className={styleModule.not_found_page_image} src={img404} />
      </div>
      <h4 className={styleModule.not_found_page_desc}>Opps! Không thể tìm thấy trang</h4>
      <h4 className={styleModule.not_found_page_desc}>Trang bạn đang tìm đang bị lỗi hoặc không tồn tại</h4>
      <Link
        to={'/'}
        className={styleModule.not_found_page_btn}
      ><i className='fa-solid fa-house' /> Quay lại trang chủ</Link>
      <p>Chiều rộng màn hình: {width}px</p>
    </div>
  )
}

export default NotFoundPage