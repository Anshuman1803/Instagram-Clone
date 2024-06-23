import React from 'react'
import loaderImg from "../Assets/Loader.gif"
function LazyLoader({customClass}) {
  return (
    <section className={`__lazyLoader ${customClass}`}>
      <div className='lazyLoaderPoster'>
        <img src={loaderImg} alt=""/>
      </div>
    </section>
  )
}

export default LazyLoader