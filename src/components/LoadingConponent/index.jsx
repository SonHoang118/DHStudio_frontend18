import React from 'react'
import styleModule from './index.module.scss'

const LoadingComponent = () => {
    return (
        <div className={styleModule.overlay}>
            <div className={styleModule.loading}>
            </div>
        </div>
    )
}

export default LoadingComponent