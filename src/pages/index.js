import styles from '../styles/index.module.scss';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, InputGroup, FormControl } from 'react-bootstrap';
import ccxt from 'ccxt';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend, TimeScale, LineController, LineElement } from 'chart.js';

// Registers the required ChartJS modules for rendering the line chart.
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale, LineController, LineElement);

export default function Page() {
    // State variables for the application.
    const [cryptos, setCryptos] = useState([]);
    const [filteredCryptos, setFilteredCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [dateRange, setDateRange] = useState('7d');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Loads all cryptocurrencies from the Binance exchange.
    useEffect(() => {
        async function loadCryptos() {
            try {
                const binance = new ccxt.binance();
                const markets = await binance.loadMarkets();
                const cryptoOptions = Object.keys(markets).map(market => ({ label: market, value: market }));
                setCryptos(cryptoOptions);
            } catch (error) {
                console.error("Error fetching markets:", error);
            }
        }

        loadCryptos();
    }, []);

    // Handles the search input change and performs input validation.
    const handleSearchChange = (e) => {
        const term = e.target.value;

        if (term.length <= 30) {
            if (searchTimeout) clearTimeout(searchTimeout);
            setSearchTerm(term);
    
            if (term) {
                setSearchTimeout(
                    setTimeout(() => {
                        const filtered = cryptos.filter(crypto => crypto.label.toLowerCase().includes(term.toLowerCase()));
                        setFilteredCryptos(filtered);
                        logSearchedCrypto(term);
                    }, 1000)
                );
            } else {
                setFilteredCryptos([]);
            }
    
            setErrorMessage('');
        } else {
            setErrorMessage('Invalid input. Maximum 30 characters allowed.');
        }
    };

    // Triggers once a cryptocurrency is selected from the dropdown.
    const handleCryptoSelect = (selectedOption) => {
        setSelectedCrypto(selectedOption);
        setFilteredCryptos([]);
        setSearchTerm('');
        logSelectedCrypto(selectedOption.label);
    };

    // Logs searched/selected crypto term to the backend.
    function logSearchedCrypto(searchTerm) {
        fetch('http://localhost:3002/log/searched', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error logging search term:', error));
    }

    function logSelectedCrypto(selectedCrypto) {
        fetch('http://localhost:3002/log/selected', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedCrypto })
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error logging selected crypto:', error));
    }

    // Fetches and sets the chart data once a crypto is selected and/or the date range is changed.
    useEffect(() => {
        if (selectedCrypto) {
            async function fetchChartData() {
                try {
                    const binance = new ccxt.binance();
                    const daysMapping = { '1d': 1, '7d': 7, '30d': 30 };
                    const days = daysMapping[dateRange];
                    const ohlcv = await binance.fetchOHLCV(selectedCrypto.value, '1d', binance.parse8601(new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000).toISOString()));

                    const dates = ohlcv.map(entry => new Date(entry[0]).toISOString());
                    const closingPrices = ohlcv.map(entry => entry[4]);

                    setChartData({
                        labels: dates,
                        datasets: [{
                            label: `Price of ${selectedCrypto.label}`,
                            data: closingPrices,
                            borderColor: 'rgba(75,192,192,1)',
                            fill: false
                        }]
                    });
                } catch (error) {
                    console.error("Error fetching chart data:", error);
                }
            }

            fetchChartData();
        }
    }, [selectedCrypto, dateRange]);

    // Renders the main component UI.
    return (
        <Container className={styles.main}>
            <Row className={styles.row}>
                <Col>
                    {errorMessage && <Alert className={styles.alertDanger} variant="danger">{errorMessage}</Alert>}
                    <InputGroup>
                        <FormControl
                            className={styles.cryptoSearch}
                            placeholder="Search for a cryptocurrency"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                    {filteredCryptos.slice(0, 10).map(crypto => (
                        <div key={crypto.value} className={styles.cryptoItem} onClick={() => handleCryptoSelect(crypto)}>
                            {crypto.label}
                        </div>
                    ))}
                </Col>
            </Row>
            <Row className={styles.row}>
                <Col>
                    <Form.Control className={styles.dateSelect} as="select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                        <option value="1d">1 Day</option>
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row className={styles.row}>
                <Col className={styles.lineChart}>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day'
                                    }
                                }
                            }
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
}
