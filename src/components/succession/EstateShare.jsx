
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EstateShareChart = ({ share_percent = 25 }) => {
  const data = [
    { name: "Share", value: share_percent },
    { name: "Remaining", value: 100 - share_percent },
  ];

  const COLORS = ["#4FC2F8","#FFD54F"];

  return (
    <div
      style={{
        width: 65,
        height: 65,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={30}  
            dataKey="value"
            startAngle={90}
            endAngle={450}
            paddingAngle={1}
            stroke="#fff"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "0.75rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EstateShareChart;
