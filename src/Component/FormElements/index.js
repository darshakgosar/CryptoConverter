import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Select from 'react-select';

const CustomForm = (props) => {

    const [cryptoList, setCryptoList] = useState([]);
    const [result, setResult] = useState({});
    const {
        crypto,
        quantity,
        currency,
        amount,
        cryptoSymbol,
        currencySymbol
    } = props.inputs;
    const currencies = [
        { value: "USD", label: "USD", symbol: '$', image: "https://cdn.shopify.com/s/files/1/2078/5043/t/59/assets/USD.png?13296612461826194053" },
        { value: "EUR", label: "EUR", symbol: '€', image: "https://cdn.shopify.com/s/files/1/2078/5043/t/59/assets/EUR.png?11949257934149418133" },
        { value: "GBP", label: "GBP", symbol: '£', image: "https://cdn.shopify.com/s/files/1/2078/5043/t/59/assets/GBP.png?11949257934149418133" }
    ]

    // handle onChange event of the dropdown
    const handleChange = e => {
        const { name, value } = e.target;
        props.setErrorMessages({});
        props.setInputs(inputs => ({
            ...inputs,
            [name]: value,
            'cryptoSymbol': cryptoList.find(c => c.value === crypto)?.symbol,
            'currencySymbol': currencies.find(c => c.value === currency)?.symbol
        }));
    }

    // handling on crypto-currency change
    const onCryptoChange = e => {
        props.setErrorMessages({});
        props.setInputs(inputs => ({
            ...inputs,
            'crypto': e.value
        }));
    }

    // handling on currency change
    const onCurrencyChange = e => {
        props.setErrorMessages({});
        props.setInputs(inputs => ({
            ...inputs,
            'currency': e.value
        }));
    }

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === props.errorMessages.name && (
            <div className="error position-absolute neutral-100 pt-2 text-align-left">{props.errorMessages.message}</div>
        );

    // On entering the quantity the below function is triggered for updating the price based on currency and crypto
    const convertCrypto = async () => {
        if (currency === undefined || currency === "") return;
        if (crypto === undefined || crypto === "") return;
        if (quantity === undefined || quantity === "") return;

        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${currency}`;

        const cryptoconvert = await axios.get(url);
        setResult(cryptoconvert.data.RAW[crypto][currency]);
        if (quantity > 0) {
            props.setAmount(currencies.find(c => c.value === currency)?.symbol + " " + (cryptoconvert.data.RAW[crypto][currency]?.PRICE * quantity))
        }
    }

    // Is triggered when inputs are changed
    useEffect(() => {
        convertCrypto();
    }, [props.inputs]);

    // Fetches live cryptos available and populates a crypto currency list
    useEffect(() => {
        const consultarAPI = async () => {
            const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD"

            const liveCryptoList = await axios.get(url);
            let expectedCryptoList = [];
            if (liveCryptoList && liveCryptoList.data && liveCryptoList.data.Data) {
                for (var i = 0; i < liveCryptoList.data.Data.length; i++) {
                    expectedCryptoList.push({
                        label: liveCryptoList.data.Data[i].CoinInfo.Name,
                        value: liveCryptoList.data.Data[i].CoinInfo.Name,
                        name: liveCryptoList.data.Data[i].CoinInfo.FullName,
                        symbol: liveCryptoList.data.Data[i].CoinInfo.ImageUrl,
                        id: liveCryptoList.data.Data[i].CoinInfo.Id
                    })
                }
                props.setInputs(inputs => ({
                    ...inputs,
                    'crypto': expectedCryptoList[0]?.value,
                    'currency': currencies[0]?.value
                }));
                setCryptoList(expectedCryptoList)
            }
        }
        consultarAPI();
    }, []);

    return (
        <div className={`${props.isShown ? 'w-100' : 'flex-display flex-direction-column justify-center align-center'} `}>
            <Form onSubmit={props.handleSave} className={`row mt-27 flex-display custom-form-elements align-items-flex-end justify-center ${props.isShown ? 'w-90' : 'w-100 pl-20 pr-20'}`}>
                <Form.Group className="mb-3 col-xs-12 col-sm-12 col-md-2 col-xl-2 text-align-left" controlId="formCrypto">
                    <label className="" htmlFor="formCrypto">Currency from</label>
                    <Select
                        value={cryptoList.filter(({ value }) => value === crypto) || ''}
                        name="crypto"
                        options={cryptoList}
                        onChange={onCryptoChange}
                        formatOptionLabel={crypt => (
                            <div className="currency-option flex-display align-center">
                                <img className={`${props.isShown ? 'w-30' : 'w-15'} pr-8`} src={`https://www.cryptocompare.com${crypt.symbol}`} height={25} width={25} />
                                <span>{crypt.name}</span>
                            </div>
                        )}
                    />
                </Form.Group>
                <Form.Group className="mb-3 col-xs-12 col-sm-12 col-md-2 col-xl-2 text-align-left pt-10" controlId="formQuantity">
                    <label className="" htmlFor="formQuantity">Amount</label>
                    <Form.Control
                        className="pt-8 pb-8 pl-8 pr-16 br-5 w-100 h-100"
                        onChange={handleChange}
                        name="quantity"
                        value={quantity || ''}
                        type="number"
                        placeholder="Enter Quantity" required />
                    {renderErrorMessage("quantity")}
                </Form.Group>
                <p className={`${props.isShown ? '' : 'm-0'} equalTo `}>=</p>
                <Form.Group className="mb-3 col-xs-12 col-sm-12 col-md-2 col-xl-2 text-align-left" controlId="formCurrency">
                    <label className="" htmlFor="formCurrency">Currency to</label>
                    <Select
                        value={currencies.filter(({ value }) => value === currency) || ''}
                        name="currency"
                        options={currencies}
                        onChange={onCurrencyChange}
                        formatOptionLabel={cur => (
                            <div className="currency-option flex-display align-center">
                                <img className={`${props.isShown ? 'w-30' : 'w-15'} pr-8`} src={cur.image} height={25} width={25} />
                                <span>{cur.label}</span>
                            </div>
                        )}
                    />
                </Form.Group>
                <Form.Group className="mb-3 col-xs-12 col-sm-12 col-md-2 col-xl-2 text-align-left pt-10" controlId="formAmount">
                    <label className="" htmlFor="formAmount">Amount</label>
                    <Form.Control
                        className="pt-8 pb-8 pl-8 pr-16 br-5 w-100 h-100"
                        onChange={handleChange}
                        name="amount"
                        type="text"
                        value={quantity > 0 ? currencies.find(c => c.value === currency).symbol + " " + (result.PRICE * quantity) : '' || ''}
                        disabled={true}
                        placeholder="Amount" required />
                </Form.Group>
                <Button className={` ${props.isShown ? '' : 'mt-20'} mb-3 col-xs-11 col-sm-11 col-md-1 col-xl-1`} type="submit">
                    <span className="">Save</span>
                </Button>
            </Form>
        </div>
    )
}

export default CustomForm;