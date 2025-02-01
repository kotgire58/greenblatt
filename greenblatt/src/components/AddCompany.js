import { useState } from "react"
import axios from "axios"

function AddCompany({ refreshCompanies }) {
  const [isManualEntry, setIsManualEntry] = useState(true)
  const [symbol, setSymbol] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    EBIT: "",
    enterpriseValue: "",
    marketCap: "",
    debt: "",
    cash: "",
    netFixedAssets: "",
    netWorkingCapital: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isManualEntry) {
        const dataToSend = {
          ...formData,
          EBIT: Number.parseFloat(formData.EBIT),
          enterpriseValue: formData.enterpriseValue ? Number.parseFloat(formData.enterpriseValue) : undefined,
          marketCap: Number.parseFloat(formData.marketCap),
          debt: Number.parseFloat(formData.debt),
          cash: Number.parseFloat(formData.cash),
          netFixedAssets: Number.parseFloat(formData.netFixedAssets),
          netWorkingCapital: Number.parseFloat(formData.netWorkingCapital),
        }
        await axios.post("http://localhost:5000/api/companies", dataToSend)
      } else {
        await axios.get(`http://localhost:5000/api/company/${symbol}`)
      }

      setFormData({
        name: "",
        EBIT: "",
        enterpriseValue: "",
        marketCap: "",
        debt: "",
        cash: "",
        netFixedAssets: "",
        netWorkingCapital: "",
      })
      setSymbol("")
      refreshCompanies()
    } catch (err) {
      console.error(err)
      setError(
        isManualEntry ? "Error adding company. Please try again." : "Error fetching company data. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Add Company Data</h2>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="entryType"
            checked={isManualEntry}
            onChange={() => setIsManualEntry(true)}
          />
          <span className="ml-2">Manual Entry</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input
            type="radio"
            className="form-radio"
            name="entryType"
            checked={!isManualEntry}
            onChange={() => setIsManualEntry(false)}
          />
          <span className="ml-2">Fetch by Symbol</span>
        </label>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isManualEntry ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="EBIT"
              placeholder="EBIT"
              value={formData.EBIT}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="enterpriseValue"
              placeholder="Enterprise Value (optional)"
              value={formData.enterpriseValue}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="marketCap"
              placeholder="Market Cap"
              value={formData.marketCap}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="debt"
              placeholder="Debt"
              value={formData.debt}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="cash"
              placeholder="Cash"
              value={formData.cash}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="netFixedAssets"
              placeholder="Net Fixed Assets"
              value={formData.netFixedAssets}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              name="netWorkingCapital"
              placeholder="Net Working Capital"
              value={formData.netWorkingCapital}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </>
        ) : (
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter Stock Symbol"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : isManualEntry ? "Add Company" : "Fetch Company Data"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default AddCompany

