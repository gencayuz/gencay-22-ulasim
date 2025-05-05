
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

export const StatCard = ({ title, count, icon: Icon, color, onClick }: StatCardProps) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-full bg-${color}-100`}>
        <Icon className={`h-4 w-4 text-${color}-500`} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{count}</p>
    </CardContent>
    <CardFooter>
      <Button variant="ghost" size="sm" className="w-full">Görüntüle</Button>
    </CardFooter>
  </Card>
);
