# Okso
Your hospital discharge summary, broken into blocks you can actually follow - in your language, at your reading level, on your phone.

## Project Overview
Okso is a web application designed to transform hospital discharge summaries into accessible, easy-to-understand blocks of information. The application aims to improve patient comprehension and engagement by presenting medical information in a user-friendly format.

## Features
- **Block-based Display**: Discharge summaries are broken down into manageable blocks, each representing a specific piece of information (medications, follow-up appointments, etc.).
- **Language Support**: Users can select their preferred language for the discharge summary, making it accessible to a wider audience.
- **Reading Level Assessment**: The application assesses the reading level of the discharge summary and adjusts the presentation accordingly.
- **Text-to-Speech**: Users can listen to the discharge summary, enhancing accessibility for those with reading difficulties.
- **Mobile-Friendly Design**: The application is optimized for mobile devices, ensuring that users can access their discharge summaries on the go.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Okso
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## To-Do List
1. Create a realistic synthetic discharge summary for testing.
2. Implement the parsing logic in `useSummaryParser.ts` to convert text/image input into JSON blocks.
3. Develop the `DischargeSummary` component to render blocks based on parsed data.
4. Create the `Block` component to handle different block types and their functionalities.
5. Implement the `LanguageSelector` component to allow language selection and trigger translations.
6. Set up the `Home` page with introductory content and navigation.
7. Develop the `SummaryView` page to display the parsed discharge summary and allow interactions.
8. Implement API calls in `api.ts` for processing discharge summaries and retrieving translations.
9. Create utility functions in `readingLevel.ts` to assess and adjust the reading level of text.
10. Style components using Tailwind CSS for a mobile-first design.
11. Implement accessibility features such as text-to-speech and pictograms.
12. Test the application thoroughly to ensure all features work as intended.
13. Update `README.md` with project details and usage instructions.
14. Review and refine the project based on feedback and testing results.