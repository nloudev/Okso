// This file contains functions for making API calls, such as sending the discharge summary for processing and retrieving translations.

import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const sendDischargeSummary = async (summaryData: unknown) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/discharge-summary`, summaryData);
        return response.data;
    } catch (error) {
        console.error('Error sending discharge summary:', error);
        throw error;
    }
};

export const getTranslations = async (text: string, language: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/translate`, { text, language });
        return response.data;
    } catch (error) {
        console.error('Error retrieving translations:', error);
        throw error;
    }
};