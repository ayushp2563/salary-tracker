import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const HoursCalculator = () => {
  const [employmentType, setEmploymentType] = useState<"fulltime" | "parttime">("fulltime");
  const [employmentStatus, setEmploymentStatus] = useState<"student" | "professional">("professional");
  const [netPay, setNetPay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!netPay || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsCalculating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('calculate-hours', {
        body: {
          employmentType,
          employmentStatus,
          netPay: parseFloat(netPay),
          startDate,
          endDate
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult(data.calculation);
      toast.success("Hours calculated successfully!");
    } catch (error) {
      console.error("Error calculating hours:", error);
      toast.error("Failed to calculate hours. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>AI Hours Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate your hours worked based on bi-weekly salary (Ontario, Canada)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Employment Type</Label>
            <RadioGroup value={employmentType} onValueChange={(value) => setEmploymentType(value as "fulltime" | "parttime")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fulltime" id="fulltime" />
                <Label htmlFor="fulltime" className="font-normal cursor-pointer">Full-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parttime" id="parttime" />
                <Label htmlFor="parttime" className="font-normal cursor-pointer">Part-time</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Employment Status</Label>
            <RadioGroup value={employmentStatus} onValueChange={(value) => setEmploymentStatus(value as "student" | "professional")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional" className="font-normal cursor-pointer">Working Professional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="font-normal cursor-pointer">Student</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="netPay">Net Pay Received in Bank Account ($)</Label>
            <Input
              id="netPay"
              type="number"
              step="0.01"
              placeholder="1000.00"
              value={netPay}
              onChange={(e) => setNetPay(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Enter the after-tax amount you received</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Bi-week Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Bi-week End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? "Calculating..." : "Calculate Hours"}
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-muted rounded-lg space-y-3">
            <h3 className="font-semibold text-xl mb-4 text-foreground">Calculation Results</h3>
            <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">{result}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
