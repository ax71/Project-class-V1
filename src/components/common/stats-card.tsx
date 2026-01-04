import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, LucideIcon } from "lucide-react";

// Definisikan tipe props agar tidak menggunakan 'any'
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon; // Tipe khusus untuk icon dari lucide-react
  color: string; // Contoh: "bg-blue-100"
  textColor: string; // Contoh: "text-blue-600"
  subtext: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  textColor,
  subtext,
}: StatsCardProps) {
  return (
    <Card className="shadow-sm border-none hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          </div>

          <div className={`p-3 rounded-xl bg-opacity-50 ${color}`}>
            <Icon size={24} className={textColor} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <TrendingUp size={12} className="text-green-500" />
          {subtext}
        </p>
      </CardContent>
    </Card>
  );
}
