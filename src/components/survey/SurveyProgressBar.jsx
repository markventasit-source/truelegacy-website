const SurveyProgressBar = ({ current = 0, total = 0 }) => {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          {total > 0 ? `Question ${current + 1} of ${total}` : "Loading..."}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-black"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default SurveyProgressBar;
