"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { GlassWater, Plus } from "lucide-react";
import { useHydration } from "@/hooks/use-hydration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FormValues = {
  customAmount: number;
};

const predefinedAmounts = [250, 500, 750];

export function LogIntake() {
  const { addIntake } = useHydration();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const [isCustom, setIsCustom] = useState(false);

  const handlePredefinedAdd = (amount: number) => {
    addIntake(amount);
    toast({
      title: "Intake Logged!",
      description: `You've added ${amount}ml.`,
    });
  };

  const onCustomSubmit: SubmitHandler<FormValues> = (data) => {
    const amount = Number(data.customAmount);
    if (amount > 0) {
      addIntake(amount);
      toast({
        title: "Intake Logged!",
        description: `You've added ${amount}ml.`,
      });
      reset();
      setIsCustom(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlassWater className="text-primary" />
          Log Your Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {predefinedAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="h-20 flex-col gap-1"
              onClick={() => handlePredefinedAdd(amount)}
            >
              <GlassWater className="h-6 w-6" />
              <span>{amount} ml</span>
            </Button>
          ))}
        </div>
        
        {isCustom ? (
          <form onSubmit={handleSubmit(onCustomSubmit)} className="space-y-2">
            <Input
              type="number"
              placeholder="Enter custom amount (ml)"
              {...register("customAmount", { valueAsNumber: true, required: true, min: 1 })}
              className={cn(errors.customAmount && "border-destructive")}
            />
            <div className="flex gap-2">
              <Button type="submit" className="w-full">
                Add Custom Amount
              </Button>
              <Button variant="ghost" onClick={() => setIsCustom(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setIsCustom(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Amount
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
