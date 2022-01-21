import { useState } from 'react';
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';

export const CheckoutForm = () => {
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [cardDisabled, setCardDisabled] = useState(false);
  const { bt } = useBasisTheory();

  const submit = async () => {
    setCardDisabled(true);
    if (bt) {
      try {
        const token = await bt.atomicCards.create({
          card: bt?.getElement('myCard'),
        });
        alert(token.id);
      } catch (e) {
        console.error(e);
      }
    }
    setCardDisabled(false);
  };

  return (
    <div id="form">
      <div className="row row-input">
        <CardElement
          id="myCard"
          disabled={cardDisabled}
          style={{
            fonts: [
              'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap',
            ],
            base: {
              color: '#fff',
              fontWeight: 500,
              fontFamily: "'Source Sans Pro'",
              fontSize: '16px',
              fontSmooth: 'antialiased',
              '::placeholder': {
                color: '#6b7294',
              },
              ':disabled': {
                // backgroundColor: 'blue',
              },
            },
            invalid: {
              color: '#ffc7ee',
            },
            complete: {
              color: '#1ad1db',
              textAlign: 'right',
            },
          }}
          onChange={({ complete }) => {
            setSubmitDisabled(!complete);
          }}
        />
      </div>
      <div className="row row-helper">
        Try using "4242 4242 4242 4242" with any expiration and CVC.
      </div>
      <button
        id="submit_button"
        disabled={submitDisabled}
        type="button"
        onClick={submit}
      >
        Submit
      </button>
    </div>
  );
};
