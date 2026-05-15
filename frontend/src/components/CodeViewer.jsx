import { useLocation } from "react-router";
function CodeViewer() {
  let {state}=useLocation()
  return (
    <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto">
      <code>
        {state?.code}
      </code>

    </pre>
  );
}

export default CodeViewer;