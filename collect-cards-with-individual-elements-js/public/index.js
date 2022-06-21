/* global BasisTheory */

const ELEMENTS_KEY = 'key_XVB48UzHJ57TdPtmLhJa9e';

let cardNumber;
let cardExpirationDate;
let cardVerificationCode;
let cardElements;
let cardBrand;
let cardNumberComplete = false;
let cardExpirationDateComplete = false;
let cardVerificationCodeComplete = false;
const style = {
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
};

window.addEventListener('load', async () => {
  await BasisTheory.init(ELEMENTS_KEY, {
    elements: true,
  });

  cardNumber = BasisTheory.createElement('cardNumber', {
    targetId: 'card_number',
    style,
  });

  cardExpirationDate = BasisTheory.createElement('cardExpirationDate', {
    targetId: 'card_expiration_date',
    style,
  });

  cardVerificationCode = BasisTheory.createElement('cardVerificationCode', {
    targetId: 'card_verification_code',
    cardBrand,
    style,
  });

  await cardNumber.mount('#card_number');
  await cardExpirationDate.mount('#card_expiration_date');
  await cardVerificationCode.mount('#card_verification_code');
  cardElements = [cardNumber, cardExpirationDate, cardVerificationCode];

  const button = document.querySelector('#submit_button');

  cardNumber.on('change', (e) => {
    cardNumberComplete = e.complete;

    // update cvc with card brand
    if (e.cardBrand !== cardBrand) {
      cardBrand = e.cardBrand;

      cardVerificationCode.update({
        cardBrand,
      });
    }

    if (
      cardNumberComplete &&
      cardExpirationDateComplete &&
      cardVerificationCodeComplete
    ) {
      button.disabled = false;
    }
  });

  cardExpirationDate.on('change', (e) => {
    cardExpirationDateComplete = e.complete;

    if (
      cardNumberComplete &&
      cardExpirationDateComplete &&
      cardVerificationCodeComplete
    ) {
      button.disabled = false;
    }
  });

  cardVerificationCode.on('change', (e) => {
    cardVerificationCodeComplete = e.complete;

    if (
      cardNumberComplete &&
      cardExpirationDateComplete &&
      cardVerificationCodeComplete
    ) {
      button.disabled = false;
    }
  });
});

function disableCardElements() {
  cardElements.forEach((element) => {
    element.update({
      disabled: true,
    });
  });
}

function enableCardElements() {
  cardElements.forEach((element) => {
    element.update({
      disabled: true,
    });
  });
}

function displaySuccess() {
  document.querySelector('#error').style.display = 'none';
  document.querySelector('#success').style.display = 'flex';
}

function displayError() {
  document.querySelector('#success').style.display = 'none';
  document.querySelector('#error').style.display = 'flex';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function submitCard() {
  disableCardElements();

  try {
    const token = await BasisTheory.tokens.create({
      type: 'card',
      data: {
        number: cardNumber,
        expiration_month: cardExpirationDate.month(),
        expiration_year: cardExpirationDate.year(),
        cvc: cardVerificationCode,
      },
    });

    const response = await fetch(`/api/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        card_token_id: token.id,
      }),
    });

    const success = (await response.json()).success;

    if (success) {
      displaySuccess();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    displayError();
  }

  enableCardElements();
}
