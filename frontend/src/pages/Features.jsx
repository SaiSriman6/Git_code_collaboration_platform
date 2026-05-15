function Features() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        Platform Features
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
             Repository Management
          </h2>
          <p>
            Create, update, and manage your repositories easily.
          </p>
        </div>

      
        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
             File Upload & Editing
          </h2>
          <p>
            Upload files and edit code directly in the browser.
          </p>
        </div>

       
        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
             Commit History
          </h2>
          <p>
            Track all changes with detailed commit history.
          </p>
        </div>

      
        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
             Pull Requests
          </h2>
          <p>
            Propose changes and collaborate with team members.
          </p>
        </div>

       
        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
            Issue Tracking
          </h2>
          <p>
            Report bugs and manage feature requests efficiently.
          </p>
        </div>

        

        
        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
             Code Review Comments
          </h2>
          <p>
            Comment on specific lines of code in pull requests.
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
             Real-time Notifications
          </h2>
          <p>
            Get notified instantly about PR updates and comments.
          </p>
        </div>

  
        <div className="bg-white p-6 rounded shadow-2xl">
          <h2 className="text-xl font-semibold mb-2">
            Secure Authentication
          </h2>
          <p>
            Login system with protected routes and user sessions.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Features;