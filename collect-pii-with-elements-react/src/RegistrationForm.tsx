import React, { useState } from 'react';
import { TextElement, useBasisTheory } from '@basis-theory/basis-theory-react';

const inputStyle = {
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
};

const ssnMask = [
  /\d/u,
  /\d/u,
  /\d/u,
  '-',
  /\d/u,
  /\d/u,
  '-',
  /\d/u,
  /\d/u,
  /\d/u,
  /\d/u,
];

export const RegistrationForm = (): JSX.Element => {
  const [nameEmpty, setNameEmpty] = useState(true);
  const [ssnComplete, setSsnComplete] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [tokens, setTokens] = useState('');
  const [isError, setIsError] = useState(false);
  const { bt } = useBasisTheory();

  const submit = async (): Promise<void> => {
    setIsBusy(true);
    setIsError(false);

    if (bt) {
      try {
        const response = await bt.tokenize({
          fullName: bt.getElement('fullName'),
          ssn: {
            type: 'social_security_number',
            data: bt.getElement('ssn'),
          },
        });

        setTokens(JSON.stringify(response, undefined, 2));
      } catch (error) {
        setIsError(true);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

    setIsBusy(false);
  };

  const submitDisabled = nameEmpty || !ssnComplete || isBusy;

  return (
    <>
      <div id="form">
        <div className={`row ${isError && 'visible'}`} id="error">
          Error occurred - check the console
        </div>
        <div className="row row-input">
          <label htmlFor="fullName">Full Name</label>
          <TextElement
            id="fullName"
            placeholder="Jane Doe"
            aria-label="Full Name"
            disabled={isBusy}
            style={inputStyle}
            onChange={({ empty }) => {
              setNameEmpty(empty);
            }}
          />
        </div>
        <div className="row row-input">
          <label htmlFor="fullName">SSN</label>
          <TextElement
            id="ssn"
            placeholder="123-45-6789"
            aria-label="Social Security Number"
            mask={ssnMask}
            disabled={isBusy}
            style={inputStyle}
            onChange={({ complete }) => {
              setSsnComplete(complete);
            }}
            transform={/[-]/u}
          />
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
          <pre id="token" className={tokens && 'expanded'}>
            {tokens}
          </pre>
        </div>
      </div>
    </>
  );
};
