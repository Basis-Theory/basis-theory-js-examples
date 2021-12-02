/* global BasisTheory */

const ELEMENTS_KEY = 'key_XVB48UzHJ57TdPtmLhJa9e';

let routingNumber;
let accountNumber;

const options = {
  style: {
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
    complete: {},
  },
};

window.addEventListener('load', async () => {
  await BasisTheory.init(ELEMENTS_KEY, {
    elements: true,
  });

  routingNumber = BasisTheory.elements.create('text', {
    ...options,
    targetId: 'routingNumber',
    placeholder: 'Routing Number',
    'aria-label': 'Routing Number',
    mask: [
      /\d/u,
      /\d/u,
      /\d/u,
      /\d/u,
      ' ',
      /\d/u,
      /\d/u,
      /\d/u,
      /\d/u,
      ' ',
      /\d/u,
    ],
    transform: /\s/u, // strip out spaces from mask above
  });
  accountNumber = BasisTheory.elements.create('text', {
    ...options,
    targetId: 'accountNumber',
    placeholder: 'Account Number',
    'aria-label': 'Account Number',
  });

  await routingNumber.mount('#routing_number');
  await accountNumber.mount('#account_number');
});

function disableBank() {
  [routingNumber, accountNumber].forEach((element) =>
    element.update({
      disabled: true,
    })
  );
}

function enableBank() {
  [routingNumber, accountNumber].forEach((element) =>
    element.update({
      disabled: false,
    })
  );
}

function displaySuccess() {
  document.querySelector('#error').style.display = 'none';
  document.querySelector('#success').style.display = 'flex';
}

function displayError() {
  document.querySelector('#error').style.display = 'none';
  document.querySelector('#error').style.display = 'flex';
}

// eslint-disable-next-line no-unused-vars
async function submitBank() {
  disableBank();

  const token = await BasisTheory.elements.atomicBank.create({
    bank: {
      routingNumber,
      accountNumber,
    },
  });

  const response = await fetch(`/api/bank/fund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      bank_token_id: token.id,
    }),
  });

  const success = (await response.json()).success;

  if (success) {
    displaySuccess();
  } else {
    displayError();
  }

  enableBank();
}
