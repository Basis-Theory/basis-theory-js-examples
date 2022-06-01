import React from 'react';
import {
  useBasisTheory,
  BasisTheoryProvider,
} from '@basis-theory/basis-theory-react';
import './App.css';
import { CheckoutForm } from './CheckoutForm';

const ELEMENTS_API_KEY = 'key_XVB48UzHJ57TdPtmLhJa9e';

function App(): JSX.Element {
  const { bt } = useBasisTheory(ELEMENTS_API_KEY, {
    elements: true,
  });

  return (
    <BasisTheoryProvider bt={bt}>
      <div className="container">
        <CheckoutForm />
      </div>
    </BasisTheoryProvider>
  );
}

export default App;
