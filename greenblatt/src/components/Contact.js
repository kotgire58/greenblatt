const Contact = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Me</h1>
      <p className="mb-4">
        I'm a student at Northeastern University, pursuing a Master of Science in Software Engineering Systems. I'm
        currently looking for full-time opportunities in software development and engineering.
      </p>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Kamal Kotgire</h2>
        <p className="mb-2">
          <strong>Location:</strong> Boston, MA
        </p>
        <p className="mb-2">
          <strong>Email:</strong>{" "}
          <a href="mailto:kotgire.k@northeastern.edu" className="text-blue-600 hover:underline">
            kotgire.k@northeastern.edu
          </a>
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> (857)-395-2210
        </p>
        <p className="mb-2">
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/kamal-kotgire"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            linkedin.com/in/kamal-kotgire
          </a>
        </p>
        <p className="mb-2">
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/kamalkotgire"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            github.com/kamalkotgire
          </a>
        </p>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Languages:</strong> HTML5, CSS3, Sass, C, Java, TypeScript, JavaScript, SQL, Python, JSON / XML, Linux
          </li>
          <li>
            <strong>Frameworks:</strong> Node.js, React, Next.js, Vue.js, Django, Angular, Material-UI, Balsamiq, Moqup,
            Figma
          </li>
          <li>
            <strong>Database:</strong> MongoDB, MySQL, PostgreSQL, DBMS, Redis, Cloudinary, AWS RDS, DynamoDB, PowerBI
          </li>
          <li>
            <strong>Cloud:</strong> AWS, Terraform, IaC, Docker, DigitalOcean, .NET, Bash
          </li>
          <li>
            <strong>Dev Tools:</strong> Git, IntelliJ IDEA, Visual Studio, CI/CD pipelines, Agile, JIRA, RabbitMQ, GitHub,
            Postman, Slack
          </li>
        </ul>
      </div>
      <p className="mt-4">
        If you have any opportunities or would like to discuss my qualifications further, please don't hesitate to reach
        out. I'm excited about the prospect of contributing to innovative projects and continuing my growth in the field
        of software engineering.
      </p>
    </div>
  )
  
  export default Contact
  
  