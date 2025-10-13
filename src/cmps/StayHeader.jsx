import { useNavigate, useParams } from "react-router";
import { useSHowOnScroll } from "../customHooks/useShowOnScroll";
import { MiniStickyContainer } from "./SmallComponents";

export function StayHeader({ refs, stay, startDate, endDate }) {
    const { stayId } = useParams()
    const navigate = useNavigate()
    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const stickyHeader = useSHowOnScroll(570)
    const stickyReserve = useSHowOnScroll(2450)

    function handleClick() {
        const from = startDate
        const to = endDate
        console.log('from:', from, 'to:', to, 'stayId:', stayId)

        if (from && to) {
            navigate(`/stay/${stayId}/confirm-pay`)
        } else {
            scrollToSection(refs.stickyContainerRef)
        }
    }

    return (
        <div className="details-header">

            {stickyHeader &&
                <div className="stay-header main-content full">
                    <nav className='nav-bar'>
                        <span className="span-nav" onClick={() => scrollToSection(refs.photoRef)}>Photos <div className="border-bot"></div></span>
                        <span className="span-nav" onClick={() => scrollToSection(refs.amenitiesRef)}>Amenities <div className="border-bot"></div></span>
                        <span className="span-nav" onClick={() => scrollToSection(refs.reviewRef)}>Reviews <div className="border-bot"></div></span>
                        <span className="span-nav" onClick={() => scrollToSection(refs.locationRef)}>Location <div className="border-bot"></div></span>

                        {stickyReserve &&
                            <MiniStickyContainer stay={stay} startDate={startDate} endDate={endDate} onClick={handleClick} />
                        }
                    </nav>

                </div>
            }
        </div>


    )
}