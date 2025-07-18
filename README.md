# Rootstock QR Generator

A web application to generate professional receipts and QR codes for any transaction on the Rootstock blockchain.

## Features

- Fetches transaction details from the Rootstock testnet using a transaction hash
- Displays transaction details in a user-friendly format
- Generates a downloadable PDF receipt for the transaction
- Creates a QR code containing transaction information for easy sharing
- Copy transaction fields to clipboard

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd rsk_qr_generator
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

Start the development server:
```sh
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a valid Rootstock transaction hash in the input field.
2. Click **Fetch Details** to retrieve and display transaction information.
3. Download a PDF receipt or scan the QR code for transaction details.

## Project Structure

- [`src/App.js`](src/App.js): Main React component.
- [`src/TransactionReceipt.tsx`](src/TransactionReceipt.tsx): Core logic for fetching transaction data, generating receipts, and displaying QR codes.
- [`src/index.js`](src/index.js): Entry point.
- [`public/`](public/index.html): Static assets and HTML template.

## Dependencies

- [React](https://react.dev/)
- [Web3.js](https://web3js.readthedocs.io/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [qrcode.react](https://github.com/zpao/qrcode.react)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
