import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export function GuestSelector({ onGuestsChange, initialGuests = { adults: 0, children: 0, infants: 0, pets: 0 } }) {
    const [guests, setGuests] = useState(initialGuests);
    const { stayId } = useParams()

    useEffect(() => {
        setGuests(initialGuests)
    }, [initialGuests])

    const handleIncrement = (type) => {
        const newGuests = { ...guests, [type]: guests[type] + 1 }
        setGuests(newGuests)
        onGuestsChange?.(newGuests)
    }

    const handleDecrement = (type) => {
        if (guests[type] > 0) {
            const newGuests = { ...guests, [type]: guests[type] - 1 }
            setGuests(newGuests)
            onGuestsChange?.(newGuests)
        }
    }

    const guestTypes = [
        {
            type: 'adults',
            label: 'Adults',
            description: 'Ages 13 or above',
        },
        {
            type: 'children',
            label: 'Children',
            description: 'Ages 2–12',
        },
        {
            type: 'infants',
            label: 'Infants',
            description: 'Under 2',
        },
        {
            type: 'pets',
            label: 'Pets',
            description: 'Bringing a service animal?',
            isLink: true,
        },
    ]

    return (
        <SimpleBar className="suggestions-dropdown guest-selector" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {guestTypes.map(({ type, label, description, isLink }) => (
                <div key={type} className="guest-row">
                    <div className="guest-info">
                        <div className="guest-label">{label}</div>
                        <div className="guest-description">
                            {isLink ? (
                                <a href="#" className="guest-link">{description}</a>
                            ) : (
                                description
                            )}
                        </div>
                    </div>
                    <div className="guest-controls">
                        <button
                            className={`guest-button guest-button-minus ${guests[type] === 0 ? 'disabled' : ''} ${stayId && (guests.adults === 1 && guests.children === 0 && guests.infants === 0  && guests.pets === 0)} ? 'disabled' : ''}`}
                            onClick={() => handleDecrement(type)}
                            disabled={guests[type] === 0 || (stayId && guests.adults === 1 && guests.children === 0 && guests.infants === 0  && guests.pets === 0)}
                            aria-label={`Decrease ${label}`}
                        >
                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
                                <path d="M2 16h28"></path>
                            </svg>
                        </button>
                        <span className="guest-count">{guests[type]}</span>
                        <button
                            className="guest-button guest-button-plus"
                            onClick={() => handleIncrement(type)}
                            aria-label={`Increase ${label}`}
                        >
                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
                                <path d="M2 16h28M16 2v28"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </SimpleBar>
    )
}