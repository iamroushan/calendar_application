import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const frequencyData = [
  { name: "Email", count: 120 },
  { name: "LinkedIn Post", count: 80 },
  { name: "Email", count: 150 },
  { name: "Phone Call", count: 60 },
];

export const CommunicationFrequencyChart = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Communication Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1E88E5" name="Communication Count" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};