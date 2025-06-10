import { useState } from "react";
import Web3 from "web3";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const TransactionReceipt = () => {
  const [transactionId, setTransactionId] = useState("");
  
  interface TransactionDetails {
    transactionHash: string;
    from: string;
    to: string;
    cumulativeGasUsed: number;
    blockNumber: number;
    contractAddress?: string;
  }

  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const web3 = new Web3(
    `https://rootstock-testnet.g.alchemy.com/v2/N-1aVX2CdysGReBDol6UX474_vadZ0Dx`
  );

  const fetchTransactionDetails = async () => {
    if (!transactionId.trim()) {
      setError("Please enter a transaction hash");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      setTransactionDetails(null);

      const receipt = await web3.eth.getTransactionReceipt(transactionId);

      if (!receipt) {
        throw new Error("Transaction not found! Please check the hash and try again.");
      }

      setTransactionDetails({
        ...receipt,
        cumulativeGasUsed: Number(receipt.cumulativeGasUsed),
        blockNumber: Number(receipt.blockNumber),
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching transaction details");
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!transactionDetails) return;

    const {
      transactionHash,
      from,
      to,
      cumulativeGasUsed,
      blockNumber,
      contractAddress,
    } = transactionDetails;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Add header with date
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(16);
    pdf.text("Rootstock Transaction Receipt", pageWidth / 2, 15, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, 22, { align: "center" });
    
    // Add horizontal line
    pdf.setLineWidth(0.5);
    pdf.line(15, 25, pageWidth - 15, 25);
    
    // Transaction details
    pdf.setFontSize(12);
    
    // Format long strings with line breaks
    const formatLongString = (label: string, value: string, yPos: number) => {
      pdf.text(`${label}:`, 15, yPos);
      
      // Handle long strings by breaking them
      if (value.length > 60) {
        pdf.setFont("Courier"); // Use monospace font for addresses
        pdf.text(value.slice(0, 60), 15, yPos + 5);
        pdf.text(value.slice(60), 15, yPos + 10);
        pdf.setFont("Helvetica"); // Reset font
        return 15; // Return extra space needed
      } else {
        pdf.text(value, 45, yPos);
        return 0;
      }
    };
    
    let yPosition = 35;
    
    yPosition += formatLongString("Transaction Hash", transactionHash, yPosition);
    yPosition += 10;
    
    yPosition += formatLongString("From Address", from, yPosition);
    yPosition += 10;
    
    if (to) {
      yPosition += formatLongString("To Address", to, yPosition);
      yPosition += 10;
    }
    
    if (contractAddress) {
      yPosition += formatLongString("Contract Address", contractAddress, yPosition);
      yPosition += 10;
    }
    
    pdf.text(`Gas Used: ${cumulativeGasUsed}`, 15, yPosition);
    yPosition += 7;
    
    pdf.text(`Block Number: ${blockNumber}`, 15, yPosition);
    yPosition += 15;
    
    // Add QR code explanation
    pdf.text("A QR code containing this transaction information is available", 15, yPosition);
    pdf.text("in the online receipt generator.", 15, yPosition + 5);
    
    // Add footer
    pdf.setFontSize(10);
    pdf.text("This receipt was generated using the Rootstock Blockchain Receipt Generator", pageWidth / 2, 280, { align: "center" });

    pdf.save("Rootstock_Transaction_Receipt.pdf");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <div className="max-w-3xl m-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Rootstock Transaction Receipt Generator
        </h1>
        
        <p className="text-gray-600 mb-6 text-center">
          Generate professional receipts for any transaction on the Rootstock blockchain
        </p>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction hash"
              className="border p-3 w-full rounded-lg md:rounded-r-none"
            />
            <button
              onClick={fetchTransactionDetails}
              disabled={loading}
              className="p-3 bg-blue-500 text-white rounded-lg md:rounded-l-none hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? "Fetching..." : "Fetch Details"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter a valid Rootstock transaction hash to generate a receipt
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {transactionDetails && (
          <div className="mt-6 flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Transaction Details
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4 hover:bg-white p-3 rounded-lg transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-blue-600">Transaction Hash:</strong>
                      <div className="font-mono text-sm mt-1">
                        {transactionDetails.transactionHash}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(transactionDetails.transactionHash)}
                      className="text-gray-500 hover:text-blue-600 ml-2"
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                <div className="mb-4 hover:bg-white p-3 rounded-lg transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-blue-600">From:</strong>
                      <div className="font-mono text-sm mt-1">
                        {transactionDetails.from}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(transactionDetails.from)}
                      className="text-gray-500 hover:text-blue-600 ml-2"
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                {transactionDetails.to && (
                  <div className="mb-4 hover:bg-white p-3 rounded-lg transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-blue-600">To:</strong>
                        <div className="font-mono text-sm mt-1">
                          {transactionDetails.to}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(transactionDetails.to)}
                        className="text-gray-500 hover:text-blue-600 ml-2"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}
                
                {transactionDetails.contractAddress && (
                  <div className="mb-4 hover:bg-white p-3 rounded-lg transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-blue-600">Contract Address:</strong>
                        <div className="font-mono text-sm mt-1">
                          {transactionDetails.contractAddress}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(transactionDetails.contractAddress!)}
                        className="text-gray-500 hover:text-blue-600 ml-2"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}
                
                <p className="mb-4 hover:bg-white p-3 rounded-lg transition-all">
                  <strong className="text-blue-600">Cumulative Gas Used:</strong>{" "}
                  <span className="font-mono">{transactionDetails.cumulativeGasUsed.toLocaleString()}</span>
                </p>
                
                <p className="mb-4 hover:bg-white p-3 rounded-lg transition-all">
                  <strong className="text-blue-600">Block Number:</strong>{" "}
                  <span className="font-mono">{transactionDetails.blockNumber.toLocaleString()}</span>
                </p>
                
                <div className="text-sm text-gray-500 mt-4 p-3">
                  <p>Transaction verified on Rootstock blockchain</p>
                </div>
              </div>

              <button
                onClick={generatePDF}
                className="mt-6 w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex justify-center items-center gap-2"
              >
                <span>📄</span> Download PDF Receipt
              </button>
            </div>
            
            <div className="md:w-1/3 text-center mt-6 md:mt-0">
              <h3 className="text-xl font-semibold mb-4">QR Code</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <QRCodeSVG
                  value={`Transaction Hash: ${transactionDetails.transactionHash}, 
                    From: ${transactionDetails.from},
                    ${transactionDetails.to ? `To: ${transactionDetails.to},` : ''}
                    ${transactionDetails.contractAddress ? `Contract Address: ${transactionDetails.contractAddress},` : ''}
                    Cumulative Gas Used: ${transactionDetails.cumulativeGasUsed.toString()}, 
                    Block Number: ${transactionDetails.blockNumber.toString()}`}
                  size={200}
                  className="mx-auto"
                />
                <p className="text-xs text-gray-500 mt-4">
                  Scan to view transaction details
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionReceipt;