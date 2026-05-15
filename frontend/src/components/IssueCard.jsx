import {useLocation} from 'react-router'

function IssueCard() {
  let {state}=useLocation();
  return (
    <div className="border rounded p-4 mb-3">

      <h3 className="font-semibold">{state?.issue?.title}</h3>

      <p className="text-gray-600">
        {state?.issue?.description}
      </p>

      <span className="text-sm text-gray-500">
        opened by {state?.issue?.author}
      </span>

    </div>
  );
}

export default IssueCard;