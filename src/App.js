import { useEffect, useState } from 'react';

function App() {
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetch('https://alpha-asset.herokuapp.com/v1/wallet')
      .then(response => response.json())
      .then(wallet => {
        setPrivateKey(wallet.data.privateKey);
        setAddress(wallet.data.address);
      });
  }, [setPrivateKey, setAddress]);

  return (
    <div className="App">
      <h1>Alpha Cold (TestNet)</h1>
      <p>Save the information and use on transactions and balance!</p>
      <p>Private key: {privateKey}</p>
      <p>Address: {address}</p>
    </div>
  );
}

export default App;
