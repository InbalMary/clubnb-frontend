import { useNavigate, useParams } from "react-router";
import { useIsShortPage, useSHowOnScroll } from "../customHooks/useShowOnScroll";
import { MiniStickyContainer } from "./SmallComponents";
import { setCurrentOrder } from "../store/actions/order.actions";
import { calculateNights } from "../services/util.service";

export function StayHeader({ refs, stay,onClick, startDate, endDate }) {
    const { stayId } = useParams()
    const navigate = useNavigate()

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const stickyHeader = useSHowOnScroll(570)
    const stickyReserve = useSHowOnScroll(2300)
    // const isShortPage = useIsShortPage(1200)

    // function handleClick() {
    //     const from = startDate
    //     const to = endDate

    //     if (from && to) {
    //         const numNights = calculateNights(from, to)
    //         const pricePerNight = stay.price
    //         const cleaningFee = stay.cleaningFee || 0
    //         const serviceFee = Math.round(pricePerNight * 0.1)

    //         const order = {
    //             stay,
    //             host: stay.host,
    //             startDate: from,
    //             endDate: to,
    //             guests,
    //             numNights,
    //             pricePerNight,
    //             cleaningFee,
    //             serviceFee,
    //             totalPrice: numNights * pricePerNight
    //         }
    //         setCurrentOrder(order)
    //         navigate(`/stay/${stay._id}/confirm-pay`, { state: { order } })
    //     } else {
    //         scrollToSection(refs.stickyContainerRef)
    //     }
    // }

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
                            <MiniStickyContainer stay={stay} startDate={startDate} endDate={endDate} onClick={onClick} />
                        }
                    </nav>

                </div>
            }
        </div>


    )
}