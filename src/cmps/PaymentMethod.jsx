import { useState } from 'react'
import { paymentSvgs } from './Svgs'
import visaLogo from '../assets/svgs/logo_visa.svg'
import mastercardLogo from '../assets/svgs/logo_mastercard.svg'
import amexLogo from '../assets/svgs/logo_amex.svg'
import discoverLogo from '../assets/svgs/logo_discover.svg'
import jcbLogo from '../assets/svgs/logo_jcb.svg'

export function PaymentMethod({ onSelect }) {
    const [paymentMethod, setPaymentMethod] = useState('card')
    console.log(visaLogo)

    return (
        <>
            <div className="payment-options">
                {/* Credit card */}
                <div className="payment-option-wrapper">
                    <label className={`payment-radio payment-option card ${paymentMethod === 'card' ? 'active' : ''}`}>
                        <span className='credit-card-icon'>{paymentSvgs.creditCard}</span>

                        <div className='credit-card-title-logos'>
                            <span>Credit or debit card</span>
                            <div className="credit-card-logos">
                                <img src={visaLogo} alt="Visa" />
                                <img src={mastercardLogo} alt="Mastercard" />
                                <img src={amexLogo} alt="American Express" />
                                <img src={discoverLogo} alt="Discover" />
                                <img src={jcbLogo} alt="JCB" />
                            </div>
                        </div>

                        <input
                            type='radio'
                            name='method'
                            value='card'
                            checked={paymentMethod === 'card'}
                            onChange={() => {
                                setPaymentMethod('card')
                                onSelect({ type: 'card', brand: 'Visa', last4: '1234' })
                            }}
                        />
                        <span className='payment-checkmark'></span>
                    </label>
                    {paymentMethod === 'card' && (
                        <form className='credit-card-form'>
                            <div className='credit-card-block'>
                                <input type='text' placeholder='Card number' className='card-number' />
                                <input type='text' placeholder='MM/YY' className='expiry' />
                                <input type='text' placeholder='CVV' className='cvv' />
                            </div>

                            <input type='text' placeholder='ZIP code' className='zipcode' />
                            <input type='text' placeholder='Country/Region' className='country' />
                        </form>
                    )}
                </div>
                {/* Google Pay*/}
                <label className={`payment-radio payment-option googlepay ${paymentMethod === 'googlepay' ? 'active' : ''}`}>
                    <div className='googlepay-title-logo'>
                        <span className='googlepay-icon'>{paymentSvgs.googlePay}</span>
                        <span>Google Pay</span>
                    </div>
                    <input
                        type='radio'
                        name='method'
                        value={'googlepay'}
                        checked={paymentMethod === 'googlepay'}
                        onChange={() => {
                            setPaymentMethod('googlepay')
                            onSelect({ type: 'googlepay' })
                        }}
                    />
                    <span className='payment-checkmark'></span>
                </label>
            </div>

        </>
    )
}