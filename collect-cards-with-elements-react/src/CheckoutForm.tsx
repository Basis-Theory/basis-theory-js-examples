import React, { useState } from 'react';
import { CardElement, useBasisTheory } from '@basis-theory/basis-theory-react';

export const CheckoutForm = (): JSX.Element => {
  const [cardComplete, setCardComplete] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [token, setToken] = useState('');
  const [isError, setIsError] = useState(false);
  const { bt } = useBasisTheory();

  const submit = async (): Promise<void> => {
    setIsBusy(true);
    setIsError(false);

    if (bt) {
      try {
        const response = await bt.tokens.create({
          type: 'card',
          data: bt?.getElement('myCard'),
        });

        setToken(JSON.stringify(response, undefined, 2));
      } catch (error) {
        setIsError(true);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    setIsBusy(false);
  };

  const submitDisabled = !cardComplete || isBusy;

  return (
    <>
      <div id="form">
        <div className={`row ${isError && 'visible'}`} id="error">
          Error occurred - check the console
        </div>
        <div className="row row-input">
          <CardElement
            id="myCard"
            disabled={isBusy}
            style={{
              fonts: [
                'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap',
              ],
              base: {
                color: '#fff',
                fontWeight: 500,
                fontFamily: '"Inter"',
                fontSize: '16px',
                fontSmooth: 'antialiased',
                '::placeholder': {
                  color: '#6b7294',
                },
                ':disabled': {
                  backgroundColor: 'transparent',
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
              setCardComplete(complete);
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
        <div className="row">
          <pre id="token" className={token && 'expanded'}>
            {token}
          </pre>
        </div>
      </div>
    </>
  );
};
