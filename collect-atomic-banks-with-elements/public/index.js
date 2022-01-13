/* global BasisTheory */

const ELEMENTS_KEY = 'key_XVB48UzHJ57TdPtmLhJa9e';

let routingNumber;
let accountNumber;

let routingNumberComplete = false;
let accountNumberNotEmpty = false;

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

  routingNumber = BasisTheory.createElement('text', {
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
  accountNumber = BasisTheory.createElement('text', {
    ...options,
    targetId: 'accountNumber',
    placeholder: 'Account Number',
    'aria-label': 'Account Number',
  });

  await routingNumber.mount('#routing_number');
  await accountNumber.mount('#account_number');

  const submitBtn = document.querySelector('#submit_button');

  // check if routing number is complete (mask filled)
  routingNumber.on('change', (event) => {
    routingNumberComplete = event.complete;

    // update if btn is disabled
    submitBtn.disabled = !(routingNumberComplete && accountNumberNotEmpty);
  });

  // check if account number is not empty
  accountNumber.on('change', (event) => {
    accountNumberNotEmpty = !event.empty;

    // update if btn is disabled
    submitBtn.disabled = !(routingNumberComplete && accountNumberNotEmpty);
  });
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

function displaySuccess(paymentMethodToken) {
  document.querySelector('#error').style.display = 'none';
  const success = document.querySelector('#success');

  success.style.display = 'flex';
  success.innerHTML = `Created Spreedly Payment Method successfully: ${paymentMethodToken}`;
}

function displayError() {
  document.querySelector('#success').style.display = 'none';
  document.querySelector('#error').style.display = 'flex';
}

// eslint-disable-next-line no-unused-vars
async function submitBank() {
  disableBank();

  try {
    const token = await BasisTheory.atomicBanks.create({
      bank: {
        routingNumber,
        accountNumber,
      },
    });

    const response = await fetch(`/api/fund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        bank_token_id: token.id,
        name: document.querySelector('#name').value,
      }),
    });

    const { success, payment_method_token } = await response.json();

    if (success) {
      displaySuccess(payment_method_token);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    displayError();
  }

  enableBank();
}
