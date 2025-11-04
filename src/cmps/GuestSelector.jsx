import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export function GuestSelector({ onGuestsChange, initialGuests = { adults: 0, children: 0, infants: 0, pets: 0 } }) {
    const [guests, setGuests] = useState(initialGuests);
    const { stayId } = useParams()

    // useEffect(() => {
    //     setGuests(initialGuests)
    // }, [initialGuests])

    useEffect(() => {
        // When on stay details (stayId present) enforce minimum 1 adult
        const minAdults = stayId ? 1 : 0
        const init = {
            adults: Math.max(minAdults, Number(initialGuests?.adults ?? minAdults)),
            children: Math.max(0, Number(initialGuests?.children ?? 0)),
            infants: Math.max(0, Number(initialGuests?.infants ?? 0)),
            pets: Math.max(0, Number(initialGuests?.pets ?? 0))
        }
        setGuests(init)
        onGuestsChange?.(init)
    }, [onGuestsChange])

    const handleIncrement = (type) => {
        const newGuests = { ...guests, [type]: guests[type] + 1 }
        setGuests(newGuests)
        onGuestsChange?.(newGuests)
    }

    const handleDecrement = (type) => {
        const min = (type === 'adults' && stayId) ? 1 : 0
        setGuests(prev => {
            if (prev[type] <= min) return prev
            const next = { ...prev, [type]: prev[type] - 1 }
            onGuestsChange?.(next)
            return next
        })
        
        // if (guests[type] > 0) {
        //     const newGuests = { ...guests, [type]: guests[type] - 1 }
        //     setGuests(newGuests)
        //     onGuestsChange?.(newGuests)
        // }
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
            {guestTypes.map(({ type, label, description, isLink }) => {
                const min = (type === 'adults' && stayId) ? 1 : 0;
                const isDisabledDecrease = guests[type] <= min;
                return (

                    < div key={type} className="guest-row" >
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
                                className={`guest-button guest-button-minus  ${isDisabledDecrease ? 'disabled' : ''}`}
                                onClick={() => handleDecrement(type)}
                                disabled={isDisabledDecrease/*guests[type] === 0 */}
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
                )
            })
            }
        </SimpleBar >
    )
}