# Canada CRS Calculator

An interactive Comprehensive Ranking System (CRS) calculator for Canadian Express Entry immigration applications, updated with the latest 2025 immigration criteria changes.

## Features

- Compare up to three different immigration scenarios simultaneously
- Real-time score calculation
- Detailed breakdown of points by category
- Visual comparison table for easy analysis
- Updated for the March 25, 2025 Express Entry changes (removal of arranged employment points)
- **Export results to PDF** for saving or sharing your calculations
- **Automatic data saving** - your inputs are saved in your browser and restored when you return

## Scoring Categories Included

- Core/Human Capital Factors
  - Age
  - Education
  - Language proficiency
  - Canadian work experience
- Spouse/Partner Factors (if applicable)
- Skill Transferability Factors
  - Education with language proficiency and/or Canadian work experience
  - Foreign work experience with language proficiency and/or Canadian work experience
  - Certificate of qualification with language proficiency
- Additional Points
  - Provincial nomination
  - Siblings in Canada
  - French language skills
  - Canadian education

## Recent Changes (2025)

As of March 25, 2025, Immigration, Refugees and Citizenship Canada (IRCC) has officially removed the additional CRS points previously awarded for arranged employment (job offers). This calculator has been updated to reflect this significant change.

Previously, candidates could receive:
- 200 points for job offers in NOC TEER 0 Major Group 00 (senior management positions)
- 50 points for job offers in other eligible NOC categories

## Usage

The calculator can be used for:
1. Determining your current CRS score based on your profile
2. Comparing how different factors would affect your score
3. Planning strategies to improve your score
4. Understanding the impact of the 2025 changes on your Express Entry profile
5. Exporting your results to PDF for record-keeping or sharing
6. Your data is automatically saved in your browser's local storage

## Requirements

- React.js
- Tailwind CSS
- jsPDF (for PDF export functionality)

## Installation

1. Clone the repository:
```
git clone https://github.com/afmontes/canada-crs-calculator.git
```

2. Install dependencies:
```
cd canada-crs-calculator
npm install
```

3. Start the development server:
```
npm start
```

## Deployment

This project is set up to be deployed to GitHub Pages.

1. Automatic deployment:
   - The project uses GitHub Actions to automatically deploy to GitHub Pages when changes are pushed to the main branch.
   - You can view the deployed site at: https://afmontes.github.io/canada-crs-calculator

2. Manual deployment (if needed):
```
npm run deploy
```

## Disclaimer

This calculator is provided for informational purposes only. While we strive to keep the calculation algorithm up to date with the latest IRCC criteria, the official score should be verified using the tools provided by the Government of Canada.

## License

MIT