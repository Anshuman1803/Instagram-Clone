import React from 'react'

function ComponentLoader({type}) {
  return (
    <div className={`loaderContainer componentloaderContainer ${type}`}>
      <span className="Componentloader"></span>
    </div>
  )
}

export default ComponentLoader
