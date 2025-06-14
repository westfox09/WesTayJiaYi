import { useState, useEffect } from 'react';

// Stock Form Component - Handles adding new stocks
function StockForm({ onAddStock }) 
{
  // State to manage stock inputs
  const [symbol, setSymbol] = useState(''); // Stock symbol input
  const [quantity, setQuantity] = useState(''); // Controlled state for quantity
  const [price, setPrice] = useState(null); // Current stock price
  const [error, setError] = useState(''); // Error message for validation or stock fetching

  // Effect to fetch stock price when symbol changes
  useEffect(() => 
  {
    if (!symbol) return; // Skip fetching if symbol is empty

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=R4MJUY96CQ5GH191`)
      .then(response => response.json())
      .then(data => 
      {
        // Check if the response contains the stock price
        if (data["Global Quote"] && data["Global Quote"]["05. price"]) 
        {
          setPrice(parseFloat(data["Global Quote"]["05. price"])); // Set the stock price
          setError(''); // Clear any previous error message
        } 
        else 
        {
          setError("Stock price unavailable. Please check back later."); // Set error message
          setPrice(null); // Reset price to null
        }
      })
      .catch(() => 
      {
        setError("Error fetching stock data."); // Set error message
        setPrice(null); // Reset price to null
      });
  }, [symbol]);

  // Handle form submission to add a stock
  function handleSubmit(e) 
  {
    e.preventDefault();

    const purchasePrice = Number(price); // Use price from state
    const qty = Number(quantity); // Ensure quantity is correctly parsed

    // Validate inputs before adding stock
    if (!symbol || isNaN(qty) || isNaN(purchasePrice) || price === null || qty <= 0 || purchasePrice <= 0) 
    {
      setError("Invalid input: Quantity and price must be greater than 0.");
      return;
    }

    onAddStock({ symbol, quantity: qty, price: purchasePrice });

    // Reset form fields after submission
    setSymbol('');
    setQuantity('');
    setPrice(null);
    setError('');
  }

  // Render the stock form with inputs for symbol, quantity, and purchase price
  return (
    <div>
      <form onSubmit={handleSubmit} className="stock-form">
        <input type="text" id="stock-symbol" value={symbol} placeholder="Stock Symbol"
          onChange={(e) => setSymbol(e.target.value.toUpperCase())} required />

        <input type="number" id="stock-quantity" value={quantity} placeholder="Quantity"
          onChange={(e) => setQuantity(e.target.value)} required />

        <input type="number" id="stock-price" value={price || ''} placeholder="Purchase Price" required disabled />

        <button type="submit">Add Stock</button>
      </form>

      <p className="stock-status">{error}</p>
    </div>
  );
}

export default StockForm;