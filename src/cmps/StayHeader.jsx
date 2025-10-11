import { MiniStickyContainer } from "./SmallComponents";

export function StayHeader({ refs, stay, startDate, endDate }) {

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (<header className="stay-header full">
        <nav className='nav-bar'>
            <div className="nav-wrapper">
                <span className="span-nav" onClick={() => scrollToSection(refs.photoRef)}>Photos</span>
                <span className="span-nav" onClick={() => scrollToSection(refs.amenitiesRef)}>Amenities</span>
                <span className="span-nav" onClick={() => scrollToSection(refs.reviewRef)}>Reviews</span>
                <span className="span-nav" onClick={() => scrollToSection(refs.locationRef)}>Location</span>
            </div>

            {/* <MiniStickyContainer stay={stay} startDate={startDate} endDate={endDate} onClick={() => scrollToSection(refs.stickyContainerRef)} /> */}
        </nav>

    </header>)
}