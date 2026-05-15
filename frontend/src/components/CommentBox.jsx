import { useState } from "react";

function CommentBox({ onSubmit }) {

  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <div className="mt-4">

      <textarea
        className="border p-2 w-full"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Comment
      </button>

    </div>
  );
}

export default CommentBox;