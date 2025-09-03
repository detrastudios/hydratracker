"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useHydration } from "@/hooks/use-hydration";
import { useToast } from "@/hooks/use-toast";
import { generateAdaptiveReminders } from "@/ai/flows/adaptive-water-reminders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Zap, Bell, Loader2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import type { Reminder } from "@/lib/types";

const settingsSchema = z.object({
  dailyGoal: z.number().min(1, "Goal must be positive."),
  wakeUpTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  bedTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  activityLevel: z.enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive']),
  climate: z.string().min(1, "Climate is required."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsClient() {
  const { settings, updateSettings, updateReminders, isLoading } = useHydration();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit: SubmitHandler<SettingsFormValues> = (data) => {
    updateSettings(data);
    toast({
      title: "Settings Saved",
      description: "Your new settings have been applied.",
    });
  };
  
  const handleGenerateReminders = async () => {
    setIsGenerating(true);
    try {
        const currentSettings = form.getValues();
        const result = await generateAdaptiveReminders({
            dailyGoal: currentSettings.dailyGoal,
            wakeUpTime: currentSettings.wakeUpTime,
            bedTime: currentSettings.bedTime,
            activityLevel: currentSettings.activityLevel,
            climate: currentSettings.climate,
        });

        if (result && result.reminders) {
            updateReminders(result.reminders);
            toast({
                title: "Reminders Generated!",
                description: `Successfully created ${result.reminders.length} smart reminders.`,
            });
        } else {
            throw new Error("No reminders were generated.");
        }
    } catch (error) {
        console.error("Failed to generate reminders:", error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate smart reminders. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }
  
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your hydration goals and reminder preferences.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-primary" />
                Hydration Goal
              </CardTitle>
              <CardDescription>
                Set your personal daily water intake goal and other lifestyle details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dailyGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Goal (ml)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wakeUpTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wake-up Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedtime</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="lightlyActive">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                          <SelectItem value="moderatelyActive">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                          <SelectItem value="veryActive">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                          <SelectItem value="extraActive">Extra Active (very hard exercise & physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="climate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Climate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hot and dry" {...field} />
                      </FormControl>
                      <FormDescription>Describe the climate you're currently in.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>
          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-accent" />
            Smart Reminders
          </CardTitle>
          <CardDescription>
            Use AI to generate a personalized reminder schedule based on your settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateReminders} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {isGenerating ? "Generating..." : "Generate AI Reminders"}
          </Button>

          <h3 className="font-semibold pt-4">Your Reminders</h3>
          {settings.reminders.length > 0 ? (
            <ScrollArea className="h-48 w-full rounded-md border p-4">
              <ul className="space-y-3">
                {settings.reminders.map((reminder: Reminder, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-mono text-sm font-semibold">{reminder.time}</p>
                      <p className="text-sm text-muted-foreground">{reminder.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No reminders set. Generate some smart reminders or add them manually.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
