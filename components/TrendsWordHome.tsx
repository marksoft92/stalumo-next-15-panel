"use client"

import React, { useState } from 'react';

const countries = [
    { label: 'Poland', value: 'pl' },
    { label: 'Germany', value: 'de' },
    { label: 'English', value: 'en' },
];

const SearchForm = () => {
    const [selectedCountry, setSelectedCountry] = useState('pl');
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSubmit = async () => {
        const apiUrl = `https://serpapi.com/search?q=${searchQuery}&location=${selectedCountry === 'pl' ? 'Poland' : selectedCountry === 'de' ? 'Germany' : 'United States'}&google_domain=google.${selectedCountry}&hl=${selectedCountry}&gl=${selectedCountry}&device=desktop&api_key=${process.env.NEXT_PUBLIC_GNEWS}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error fetching the API:", error);
        }
    };

    return (
        <div className="p-6  bg-white rounded-md shadow-md">
            <h2 className='text-black'>max 100 zapytań miesięcznie</h2>
            <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Wybierz kraj</label>
                <select
                    id="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-black"
                >
                    {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                            {country.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 text-black">Twoje słowa kluczowe</label>
                <input
                    type="text"
                    id="searchQuery"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-black"
                    placeholder="Enter search term"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-black"
            >
                Pobierz trend dla słów kluczowych
            </button>

            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <pre className="whitespace-pre-wrap break-words text-black">
                        <h3 className='text-[1.8rem] '>Trendujące wyszukiwania w google</h3>
                        {result?.related_searches?.map((v: any, index: number) => (
                            <p key={index}>{v?.query}</p>
                        ))}
                    </pre>
                    <pre className="whitespace-pre-wrap break-words text-black">
                        <h3 className='text-[1.8rem] '>Trendujące zapytania i odpowiedzi w google</h3>
                        {result?.related_questions?.map((v: any, index: number) => (
                            <>                            <p key={index}>{v?.question}</p>
                                <p key={index + v.snippet}>{v?.snippet}</p></>
                        ))}
                    </pre>
                    W
                </div>
            )}
        </div>
    );
};

export default SearchForm;



