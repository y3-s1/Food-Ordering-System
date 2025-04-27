import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

type Props = {
  users: any[];
};

export default function AdminCharts({ users }: Props) {
  const roleCount = users.reduce((acc, curr) => {
    acc[curr.role] = (acc[curr.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(roleCount).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  return (
    <div className="bg-white p-4 shadow rounded mt-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">User Roles Distribution</h2>
      <PieChart width={300} height={250}>
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
