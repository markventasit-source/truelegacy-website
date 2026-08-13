const SurveySummaryCard = ({ score, rank }) => {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-gray-600">Your Result</div>
      <div className="mt-2 flex items-center gap-6">
        <div>
          <div className="text-xs text-gray-500">Score</div>
          <div className="text-2xl font-semibold">{score}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Rank</div>
          <div className="text-2xl font-semibold">{rank}</div>
        </div>
      </div>
    </div>
  );
};

export default SurveySummaryCard;
