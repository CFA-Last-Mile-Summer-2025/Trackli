import React from "react";

export default function ExternalLink({
  url,
  onCancel,
  onConfirm,
}: {
  url: string;
  onCancel: () => void;
  onConfirm: () => void;
}) { // scuffed css need to get proper styling eventually
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg text-black">
        <h1>Leaving Trackli</h1>
        <p>You are about to leave Trackli and visit:</p>
        <p className="text-red-600">{url}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
