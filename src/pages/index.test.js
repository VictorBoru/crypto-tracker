import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './index.js'; 

// Mock data
const mockCryptoData = {
    data: [
        {
            name: 'bitcoin',
            price: '50000',
        },
    ],
};

// Mock fetch calls to the backend
global.fetch = jest.fn(() => {
    console.log("Mock fetch called");
    return Promise.resolve({
        json: () => Promise.resolve(mockCryptoData),
    });
});

describe('Crypto Tracker Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders search input', () => {
        const { getByPlaceholderText } = render(<Page />);
        const inputElement = getByPlaceholderText('Search for a cryptocurrency');
        expect(inputElement).toBeInTheDocument();
    });

    test('renders error message on long input', async () => {
        const { getByPlaceholderText, getByText } = render(<Page />);
        const inputElement = getByPlaceholderText('Search for a cryptocurrency');
        
        fireEvent.change(inputElement, { target: { value: 'a'.repeat(31) } });

        await waitFor(() => {
            expect(getByText('Invalid input. Maximum 30 characters allowed.')).toBeInTheDocument();
        });
    });

    test('renders filtered cryptos on search', async () => {
        const { getByPlaceholderText } = render(<Page />);
        const inputElement = getByPlaceholderText('Search for a cryptocurrency');
        
        fireEvent.change(inputElement, { target: { value: 'bitcoin' } });

        await waitFor(() => {
            expect(screen.getByText(/bitcoin/i)).toBeInTheDocument();
        }, { timeout: 1000 });
    });

    test('renders date selector', () => {
        const { getByText } = render(<Page />);
        expect(getByText('1 Day')).toBeInTheDocument();
        expect(getByText('7 Days')).toBeInTheDocument();
        expect(getByText('30 Days')).toBeInTheDocument();
    });
});
