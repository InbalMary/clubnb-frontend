
export function CarouselDots({ total, currentIndex }) {

    function getVisibleDots(total, currentIndex) {
        if (total <= 5) {
            return Array.from({ length: total }).map((_, idx) => ({
                idx,
                className: idx === currentIndex ? "dot-normal active" : "dot-normal"
            }))
        }

        let visible
        let classes = []
        if (currentIndex <= 2) {
            //at start
            visible = [0, 1, 2, 3, total - 1]
            const patterns = [
                ["dot-normal active", "dot-normal", "dot-normal", "dot-small", "dot-xsmall"], // idx0
                ["dot-normal", "dot-normal active", "dot-normal", "dot-small", "dot-xsmall"], // idx1
                ["dot-normal", "dot-normal", "dot-normal active", "dot-small", "dot-xsmall"], // idx2
            ]
            classes = patterns[currentIndex]
        } else if (currentIndex >= total - 3) {
            //at end
            visible = [0, total - 4, total - 3, total - 2, total - 1]
            if (currentIndex === total - 1) {
                classes = ["dot-xsmall", "dot-small", "dot-normal", "dot-normal", "dot-normal active"]
            } else if (currentIndex === total - 2) {
                classes = ["dot-xsmall", "dot-small", "dot-normal", "dot-normal active", "dot-normal"]
            } else {
                classes = ["dot-xsmall", "dot-small", "dot-normal active", "dot-normal", "dot-normal"]
            }
        } else {
            //middle
            visible = [
                currentIndex - 2,
                currentIndex - 1,
                currentIndex,
                currentIndex + 1,
                currentIndex + 2
            ]
            classes = ["dot-small", "dot-normal", "dot-normal active", "dot-normal", "dot-small"]
        }

        // console.log("currentIndex:", currentIndex, "visible:", visible, "classes:", classes)
        return visible.map((idx, pos) => ({ idx, className: classes[pos] }))
    }
    const visibleDots = getVisibleDots(total, currentIndex)


    return (

        <div className="img-carousel-dots">
            {visibleDots.map(dot => (
                <span key={dot.idx} className={`carousel-dot ${dot.className}`} />
            ))}
        </div>
    )
}



