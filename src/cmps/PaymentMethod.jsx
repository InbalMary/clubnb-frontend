import { useState } from 'react'

export function PaymentMethod({ onNext }) {
    const [paymentMethod, setPaymentMethod] = useState('card')

    return (
        <>
            <div className="payment-options">
                {/* Credit card */}
                <div className="payment-option-wrapper">
                    <label className={`payment-radio payment-option card ${paymentMethod === 'card' ? 'active' : ''}`}>
                        <span>Credit or debit card</span>
                        <input
                            type='radio' name='method' value='card' checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
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
                    <span>Google Pay</span>
                    <input
                        type='radio' name='method' value={'googlepay'}
                        checked={paymentMethod === 'googlepay'}
                        onChange={() => setPaymentMethod('googlepay')}
                    />
                    <span className='payment-checkmark'></span>
                </label>
            </div>

        </>
    )
}