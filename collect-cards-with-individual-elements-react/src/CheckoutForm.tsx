import { useState } from 'react';
import type {
  ElementStyle,
  CardExpirationDateElement as ICardExpirationDateElement,
} from '@basis-theory/basis-theory-js/types/elements';
import {
  CardNumberElement,
  CardExpirationDateElement,
  CardVerificationCodeElement,
  useBasisTheory,
} from '@basis-theory/basis-theory-react';

export const CheckoutForm = (): JSX.Element => {
  const [brand, setBrand] = useState('unknown');
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expirationDate: false,
    cvc: false,
  });
  const [isBusy, setIsBusy] = useState(false);
  const [token, setToken] = useState('');
  const [isError, setIsError] = useState(false);
  const { bt } = useBasisTheory();

  const submit = async (): Promise<void> => {
    setIsBusy(true);
    setIsError(false);

    if (bt) {
      const expirationDate =
        bt.getElement<ICardExpirationDateElement>('cardExpirationDate'); // for access to month/year methods type checking

      try {
        const response = await bt.tokens.create({
          type: 'card',
          data: {
            number: bt.getElement('cardNumber'),
            expiration_month: expirationDate.month(),
            expiration_year: expirationDate.year(),
            cvc: bt.getElement('cardVerificationCode'),
          },
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

  const submitDisabled =
    !(cardComplete.number && cardComplete.expirationDate && cardComplete.cvc) ||
    isBusy;

  const style: ElementStyle = {
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
  };

  return (
    <>
      <div id="form">
        <div className={`row ${isError && 'visible'}`} id="error">
          Error occurred - check the console
        </div>
        <div className="row row-input">
          <CardNumberElement
            id="cardNumber"
            style={style}
            onChange={({ complete, cardBrand }) => {
              setBrand(cardBrand);
              setCardComplete({
                ...cardComplete,
                number: complete,
              });
            }}
          />
        </div>
        <div className="row row-input">
          <CardExpirationDateElement
            id="cardExpirationDate"
            style={style}
            onChange={({ complete }) => {
              setCardComplete({
                ...cardComplete,
                expirationDate: complete,
              });
            }}
          />
        </div>
        <div className="row row-input">
          <CardVerificationCodeElement
            id="cardVerificationCode"
            style={style}
            cardBrand={brand}
            onChange={({ complete }) => {
              setCardComplete({
                ...cardComplete,
                cvc: complete,
              });
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
