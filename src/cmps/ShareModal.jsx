import { Link } from "react-router";
import { showSuccessMsg } from "../services/event-bus.service";
import { Modal } from "./Modal";
import { Capacity, SmallRating } from "./SmallComponents";
import { logoSvgs } from "./Svgs";

export function ShareModal({ stay, isOpen, onClose, onClick }) {
    const shareUrl = window.location.href;
    const shareText = encodeURIComponent("Check out this amazing stay I found!");

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            header=" "
            closePosition="right"
            className="share-modal"
            useBackdrop={true}>

            <div className="share-modal">
                <h1> Share this place</h1>
                <div className="mini-stay-preview flex">
                    <img src={stay.imgUrls[0]} alt={`Stay image`} />
                    <span>
                        <p>{stay.name}</p>
                        <SmallRating readOnly={true} stay={stay} />
                        <Capacity stay={stay} />
                    </span>

                </div>
                <button className="btn open-modal" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer')}>
                    <span className="btn-share-wrapper">
                        <span className="logo-svg">{logoSvgs.facebook}</span>
                        <span className="txt">
                            Facebook
                        </span>
                    </span>
                </button>

                <button className="btn open-modal"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener,noreferrer')}>
                    <span className="btn-share-wrapper">
                        <span className="logo-svg">{logoSvgs.whatsapp}</span>
                        <span className="txt">
                            WhatsApp
                        </span>
                    </span>
                </button>


                <button className="btn open-modal" onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    showSuccessMsg("Link copied")
                }}>
                    <span className="btn-share-wrapper">
                        <span className="logo-svg">{logoSvgs.copy}</span>
                        <span className="txt">
                            Copy Link
                        </span>
                    </span>
                </button>
                <button onClick={onClick} className="btn open-modal">
                    <span className="btn-share-wrapper">
                        <span className="logo-svg">{logoSvgs.moreOptions}</span>
                        <span className="txt">
                            More options
                        </span>
                    </span>
                </button>
            </div >
        </Modal >
    )
}