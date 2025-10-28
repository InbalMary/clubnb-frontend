import { useNavigate, useParams } from "react-router";
import { useIsShortPage, useSHowOnScroll } from "../customHooks/useShowOnScroll";
import { MiniStickyContainer } from "./SmallComponents";
import { setCurrentOrder } from "../store/actions/order.actions";
import { calculateNights } from "../services/util.service";
import { useIsBreakPoint } from "../customHooks/useIsBreakPoint";

export function StayHeader({ refs, stay, onClick, startDate, endDate }) {
    const { stayId } = useParams()
    const navigate = useNavigate()

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const stickyHeader = useSHowOnScroll(570)
    const stickyReserve = useSHowOnScroll(2300)

    const isWide = useIsBreakPoint(1130)
    const isMobile = useIsBreakPoint(745)

    return (
        <>
            {!isMobile ? (
                <div className={`stay-details-header big-layout ${isWide ? 'mid-layout' : ''} ${isMobile && 'mobile'}`}>
                    {stickyHeader &&

                        <nav className='nav-bar'>
                            <span className="span-nav" onClick={() => scrollToSection(refs.photoRef)}>Photos <div className="border-bot"></div></span>
                            <span className="span-nav" onClick={() => scrollToSection(refs.amenitiesRef)}>Amenities <div className="border-bot"></div></span>
                            <span className="span-nav" onClick={() => scrollToSection(refs.reviewRef)}>Reviews <div className="border-bot"></div></span>
                            <span className="span-nav" onClick={() => scrollToSection(refs.locationRef)}>Location <div className="border-bot"></div></span>

                            {stickyReserve &&
                                <MiniStickyContainer stay={stay} startDate={startDate} endDate={endDate} onClick={onClick} />
                            }
                        </nav>
                    }
                </div>
            ) : (
                <div className={`stay-details-header big-layout ${isWide ? 'mid-layout' : ''} ${isMobile && 'mobile'}`}>

                    <MiniStickyContainer stay={stay} startDate={startDate} endDate={endDate} onClick={onClick} />
                </div>

            )}

        </>

    )
}