/* global BasisTheory */

const ELEMENTS_KEY = 'key_XVB48UzHJ57TdPtmLhJa9e';

let card;
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
    complete: {
      color: '#1ad1db',
      textAlign: 'right',
    },
  },
};

window.addEventListener('load', async () => {
  await BasisTheory.init(ELEMENTS_KEY, {
    elements: true,
  });

  card = BasisTheory.createElement('card', options);

  await card.mount('#card');

  card.on('change', (e) => {
    const button = document.querySelector('#submit_button');

    button.disabled = !e.complete;
  });
});

function disableCard() {
  card.update({
    disabled: true,
  });
}

function enableCard() {
  card.update({
    disabled: false,
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
  disableCard();

  try {
    const token = await BasisTheory.atomicCards.create({
      card,
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

  enableCard();
}
