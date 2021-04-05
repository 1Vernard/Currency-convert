import React,{useEffect,useState} from 'react'
import './App.css';
import CurrencyRow from './CurrencyRow';

const API_KEY = 'c5f1f3ad81c6a46944a40eda7ff9da80';
const BASE_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`

function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency,setFromCurrency] = useState()
  const [toCurrency,settoCurrency] = useState()
  const [amount,setAmount] = useState(1)
  const [amountInFromCurrency,setAmountInFromCurrency] = useState(true)
  const [exchangeRate, setExchangeRate] = useState()  

  let toAmount, fromAmount 

  if(amountInFromCurrency){
    fromAmount =amount
    toAmount = amount * exchangeRate
  }
  else{
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  console.log(currencyOptions)

  useEffect(()=>{
    fetch(BASE_URL)
      .then(res =>{
       return res.json()
      })
      .then(data=>{
        const firstcurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base ,...Object.keys(data.rates)])
        setFromCurrency(data.base)
        settoCurrency(firstcurrency)
        setExchangeRate(data.rates[firstcurrency])
      }).catch(error=>{
        console.log(error);
      })
  },[])

  useEffect(()=>{
    if(fromCurrency != null && toCurrency != null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res=>res.json())
        .then(data=>setExchangeRate(data.rates[toCurrency]))
    }
  },[fromCurrency,toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Welcome to react</h1>

      <hr/>
      <h2>Convert</h2>
      <CurrencyRow selectedCurrency={fromCurrency} currencyOptions = {currencyOptions} onChangeCurrency = {e =>setFromCurrency(e.target.value)} amount = {fromAmount} onChangeAmount = {handleFromAmountChange}/>

      <div className = 'equals'>=</div>

      <CurrencyRow selectedCurrency = {toCurrency} currencyOptions = {currencyOptions} onChangeCurrency = {e =>settoCurrency(e.target.value)} amount={toAmount} onChangeAmount = {handleToAmountChange}/>
      
    </>
  );
}
export default App;
