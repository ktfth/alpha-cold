import { useEffect, useState } from 'react';
import './App.css';

function Wallet() {
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
    <>
      <h1>Alpha Cold (Main)</h1>
      <p>Save the information and use on transactions and balance!</p>
      <p>Private key: {privateKey}</p>
      <p>Address: {address}</p>
    </>
  );
}

function WalletMnemonic() {
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  function fillPasswordInput(e) {
    setPassword(e.target.value);
  }

  function generateMnemonic(e) {
    if (e.keyCode === 13) {
      fetch('https://alpha-asset.herokuapp.com/v1/wallet', {
        method: 'POST',
        body: JSON.stringify({
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(wallet => {
          setAddress(wallet.data.address);
          setMnemonic(wallet.data.mnemonic);
        });
    }
  }

  return (
    <>
      <p>Save the information to use on future!</p>
      <input type="text" placeholder="Password" onChange={(e) => fillPasswordInput(e)} onKeyDown={(e) => generateMnemonic(e)}></input>
      <p>Address: {address}</p>
      <p>Mnemonic: {mnemonic}</p>
    </>
  );
}

function Balance() {
  const [balanceInput, setBalanceInput] = useState('');
  const [balance, setBalance] = useState('');

  function checkBalance(e) {
    if (e.keyCode === 13) {
      fetch('https://alpha-asset.herokuapp.com/v1/balance', {
        method: 'POST',
        body: JSON.stringify({
          privateKey: balanceInput,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(balance => {
          setBalance(balance.data.amount);
          setBalanceInput('');
        });
    }
  }

  function fillBalanceInput(e) {
    setBalanceInput(e.target.value);
  }

  return (
    <>
      <input type="text" placeholder="Private Key" onChange={(e) => fillBalanceInput(e)} onKeyUp={(e) => checkBalance(e)} value={balanceInput}></input>
      <p>Balance: {balance || "0"} BTC</p>
    </>
  );
}

function Transaction() {
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [transactionHashInput, setTransactionHashInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  function fillPrivateKeyInput(e) {
    setPrivateKeyInput(e.target.value);
  }

  function fillAddressInput(e) {
    setAddressInput(e.target.value);
  }

  function fillAmountInput(e) {
    setAmountInput(e.target.value);
  }

  function fillTransactionHashInput(e) {
    setTransactionHashInput(e.target.value);
  }

  function fillMessageInput(e) {
    setMessageInput(e.target.value);
  }

  function dispatchTransaction() {
    fetch('https://alpha-asset.herokuapp.com/v1/transaction', {
        method: 'POST',
        body: JSON.stringify({
          privateKey: privateKeyInput,
          address: addressInput,
          amount: amountInput,
          transactionHash: transactionHashInput,
          message: messageInput,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(transaction => {
          if (transaction.data.errorCode) {
            setTransactionError(`error code: ${transaction.data.errorCode} | error reason: ${transaction.data.errorReason} | exception message: ${transaction.data.exceptionMessage}`);
          } else {
            setTransactionStatus(`id: ${transaction.data.id} | hash: ${transaction.data.hash} | address: ${transaction.data.address} | block confirmations: ${transaction.data.blockConfirmations}`);
          }
        });
  }

  return (
    <>
      <p>Error: {transactionError}</p>
      <p>Status: {transactionStatus}</p>
      <input type="text" placeholder="Private Key" onChange={(e) => fillPrivateKeyInput(e)} value={privateKeyInput}></input>
      <br/>
      <input type="text" placeholder="Address" onChange={(e) => fillAddressInput(e)} value={addressInput}></input>
      <br/>
      <input type="text" placeholder="Amount. e.g: 0.0002" onChange={(e) => fillAmountInput(e)} value={amountInput}></input>
      <br/>
      <input type="text" placeholder="Transaction Hash" onChange={(e) => fillTransactionHashInput(e)} value={transactionHashInput}></input>
      <br/>
      <input type="text" placeholder="Message" onChange={(e) => fillMessageInput(e)} value={messageInput}></input>
      <br/><br/>
      <button onClick={() => dispatchTransaction()}>Send</button>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Wallet/>
      <hr/>
      <WalletMnemonic/>
      <hr/>
      <Balance/>
      <hr/>
      <Transaction/>
    </div>
  );
}

export default App;
