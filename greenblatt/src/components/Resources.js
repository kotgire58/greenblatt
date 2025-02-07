const Resources = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
  
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Video</h2>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/4-IOUObnf5o"
            title="Joel Greenblatt's Magic Formula Investing"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
  
      <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
      <ul className="list-disc list-inside space-y-3">
        <li>
          <a
            href="https://www.magicformulainvesting.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Official Magic Formula Investing Website
          </a>
        </li>
        <li>
          <a
            href="https://www.amazon.com/Little-Book-Still-Beats-Market/dp/0470624159"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            The Little Book That Still Beats the Market by Joel Greenblatt
          </a>
        </li>
        <li>
          <a
            href="https://www.investopedia.com/terms/m/magic-formula-investing.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Investopedia: Magic Formula Investing
          </a>
        </li>
      </ul>
    </div>
  )
  
  export default Resources
  
  