function CompaniesTable({ companies, deleteCompany }) {
    return (
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Companies Greenblatt Rankings</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-right">EBIT</th>
              <th className="px-4 py-2 text-right">Enterprise Value</th>
              <th className="px-4 py-2 text-right">Earning Yield</th>
              <th className="px-4 py-2 text-right">Earning Yield Rank</th>
              <th className="px-4 py-2 text-right">ROC</th>
              <th className="px-4 py-2 text-right">ROC Rank</th>
              <th className="px-4 py-2 text-right">Greenblatt's Value</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{company.name}</td>
                <td className="px-4 py-2 text-right">{company.EBIT.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{company.computedEnterpriseValue.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{company.earningYield.toFixed(2)}%</td>
                <td className="px-4 py-2 text-right">{company.earningYieldRank}</td>
                <td className="px-4 py-2 text-right">{company.ROC.toFixed(2)}%</td>
                <td className="px-4 py-2 text-right">{company.ROCRank}</td>
                <td className="px-4 py-2 text-right">{company.greenBlattsValue}</td>
                <td className="px-4 py-2 text-center">
                <button
                  onClick={() => deleteCompany(company._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  aria-label={`Delete ${company.name}`}
                >
                  Delete
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default CompaniesTable
  
  