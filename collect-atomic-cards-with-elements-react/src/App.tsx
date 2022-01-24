import React from 'react';
import {
  useBasisTheory,
  BasisTheoryProvider,
} from '@basis-theory/basis-theory-react';
import './App.css';
import { CheckoutForm } from './CheckoutForm';

function App(): JSX.Element {
  const { bt } = useBasisTheory('key_XVB48UzHJ57TdPtmLhJa9e', {
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
