import { useState } from 'react'
import { svgControls } from './Svgs.jsx'
import { CarouselDots } from './CarouselDots.jsx'

export function SingleImgCarousel({ images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const atStart = currentIndex === 0
    const atEnd = currentIndex === images.length - 1

    function scroll(direction) {
        setCurrentIndex(prev => {
            let next = prev + direction
            if (next < 0) next = 0
            if (next > images.length - 1) next = images.length - 1
            return next
        })
    }

    return (
        <div className='single-img-carousel'>
            <div className='carousel-window'>
                <div className='carousel-track'
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((img, idx) => (
                        <div className='carousel-slide' key={idx}>
                            <img src={img} alt={`slide ${idx}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="preview-carousel-controls">
                {!atStart && (
                    <button className="preview-carousel-btn left"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            ev.preventDefault()
                            scroll(-1)
                        }}
                    >
                        <span className='preview-carousel-icon'>{svgControls.chevronLeft}</span>
                    </button>
                )}
                {!atEnd && (
                    <button className="preview-carousel-btn right"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            ev.preventDefault()
                            scroll(1)
                        }
                        }
                    >
                        <span className='preview-carousel-icon'>{svgControls.chevronRight}</span>
                    </button>
                )}
            </div>
            <CarouselDots total={images.length} currentIndex={currentIndex} />
        </div>
    )
}