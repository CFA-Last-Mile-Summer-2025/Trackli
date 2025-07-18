export default function DidYouApply({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full text-black">
        <h1>Did You Apply?</h1>
        <p>Please confirm whether or not you completed the application, and we will sort it for you</p>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onNo}>No</button>
          <button onClick={onYes}>Yes</button>
        </div>
      </div>
    </div>
  );
}
