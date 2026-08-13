const QuestionCard = ({ question, value, onChange }) => {
  if (!question) return null;

  const { id, key, title, description, options = [] } = question;

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-gray-500">{id ? `Q${id}` : null}</div>
      <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      ) : null}

      <div className="mt-4 grid gap-2">
        {options.map((opt) => (
          <label
            key={`${key}-${opt}`}
            className="flex cursor-pointer items-center gap-2 rounded-md border p-3"
          >
            <input
              type="radio"
              name={key}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
