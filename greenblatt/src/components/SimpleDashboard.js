"use client"

import { useState, useEffect } from "react"

const SimpleDashboard = () => {
  const [data, setData] = useState({
    portfolioPerformance: 12.5,
    activeInvestments: 24,
    magicScore: 85,
    investmentOpportunities: 12,
  })

  const [marketTrends, setMarketTrends] = useState([])
  const [topStocks, setTopStocks] = useState([])
  const [uncommonStocks, setUncommonStocks] = useState([])

  useEffect(() => {
    // Simulating data fetch
    const fetchData = () => {
      const newMarketTrends = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
      setMarketTrends(newMarketTrends)

      // Simulating top performing stocks
      const newTopStocks = [
        { symbol: "AAPL", name: "Apple Inc.", performance: "+8.5%", magicRank: 1 },
        { symbol: "MSFT", name: "Microsoft Corporation", performance: "+6.2%", magicRank: 2 },
        { symbol: "GOOGL", name: "Alphabet Inc.", performance: "+5.7%", magicRank: 3 },
        { symbol: "AMZN", name: "Amazon.com Inc.", performance: "+4.9%", magicRank: 4 },
        { symbol: "FB", name: "Meta Platforms Inc.", performance: "+4.1%", magicRank: 5 },
      ]
      setTopStocks(newTopStocks)

      // Simulating less common stocks
      const newUncommonStocks = [
        { symbol: "LULU", name: "Lululemon Athletica Inc.", sector: "Consumer Cyclical", magicRank: 23 },
        { symbol: "ETSY", name: "Etsy Inc.", sector: "Consumer Cyclical", magicRank: 31 },
        { symbol: "CROX", name: "Crocs Inc.", sector: "Consumer Cyclical", magicRank: 42 },
        { symbol: "FIVE", name: "Five Below Inc.", sector: "Consumer Cyclical", magicRank: 56 },
        { symbol: "SFIX", name: "Stitch Fix Inc.", sector: "Consumer Cyclical", magicRank: 78 },
      ]
      setUncommonStocks(newUncommonStocks)
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: "20px",
    margin: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    flex: "1 1 200px",
  }

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: "20px",
  }

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  }

  const chartStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "200px",
    padding: "20px",
    backgroundColor: "#e0e0e0",
    borderRadius: "8px",
  }

  const barStyle = {
    width: "30px",
    backgroundColor: "#4CAF50",
    marginRight: "5px",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  }

  const thStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    padding: "10px",
    textAlign: "left",
  }

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  }

  return (
    <div>
      <h1 style={headerStyle}>Magic Formula Dashboard</h1>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2>Portfolio Performance</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.portfolioPerformance}%</p>
        </div>
        <div style={cardStyle}>
          <h2>Active Investments</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.activeInvestments}</p>
        </div>
        <div style={cardStyle}>
          <h2>Magic Score</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.magicScore}/100</p>
        </div>
        <div style={cardStyle}>
          <h2>Investment Opportunities</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{data.investmentOpportunities}</p>
        </div>
      </div>
      <div style={cardStyle}>
        <h2>Market Trends</h2>
        <div style={chartStyle}>
          {marketTrends.map((value, index) => (
            <div key={index} style={{ ...barStyle, height: `${value}%` }}></div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        <h2>Top Performing Stocks</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Symbol</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Performance</th>
              <th style={thStyle}>Magic Rank</th>
            </tr>
          </thead>
          <tbody>
            {topStocks.map((stock, index) => (
              <tr key={index}>
                <td style={tdStyle}>{stock.symbol}</td>
                <td style={tdStyle}>{stock.name}</td>
                <td style={tdStyle}>{stock.performance}</td>
                <td style={tdStyle}>{stock.magicRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={cardStyle}>
        <h2>Less Common Stocks</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Symbol</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Sector</th>
              <th style={thStyle}>Magic Rank</th>
            </tr>
          </thead>
          <tbody>
            {uncommonStocks.map((stock, index) => (
              <tr key={index}>
                <td style={tdStyle}>{stock.symbol}</td>
                <td style={tdStyle}>{stock.name}</td>
                <td style={tdStyle}>{stock.sector}</td>
                <td style={tdStyle}>{stock.magicRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SimpleDashboard

