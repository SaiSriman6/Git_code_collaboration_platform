function Home() {
  const features = [
    {
      title: "Repository Management",
      desc: "Create, organize, and manage repositories easily.",
    },
    {
      title: "File Upload & Editing",
      desc: "Upload files and edit code directly in the browser.",
    },
    {
      title: "Commit History",
      desc: "Track every change with detailed commit history.",
    },
    {
      title: "Pull Requests",
      desc: "Collaborate and review changes with your team.",
    },
    {
      title: "Issue Tracking",
      desc: "Manage bugs and feature requests efficiently.",
    },
    {
      title: "Code Review Comments",
      desc: "Discuss code changes with inline comments.",
    },
    {
      title: "Real-time Notifications",
      desc: "Get instant updates on issues and pull requests.",
    },
    {
      title: "Secure Authentication",
      desc: "Protected routes with secure user sessions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-14">
      
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-5">
          GitHub Style Collaboration Platform
        </h1>

        <p className="text-lg text-gray-600">
          Manage repositories, collaborate with developers, track issues,
          and review code in one modern platform.
        </p>
      </div>

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {feature.title}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;