"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useHydration } from "@/hooks/use-hydration";
import { useToast } from "@/hooks/use-toast";
import { generateAdaptiveReminders } from "@/ai/flows/adaptive-water-reminders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Zap, Bell, Loader2, User, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import type { Reminder } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { differenceInYears, parseISO } from "date-fns";

const settingsSchema = z.object({
  name: z.string().min(1, "Nama diperlukan."),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal lahir tidak valid." }),
  height: z.number().min(1, "Tinggi badan harus positif."),
  weight: z.number().min(1, "Berat badan harus positif."),
  gender: z.enum(['male', 'female', 'other', 'preferNotToSay']),
  profilePhoto: z.string(),
  dailyGoal: z.number().min(1, "Target harus positif."),
  wakeUpTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (JJ:mm)."),
  bedTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (JJ:mm)."),
  activityLevel: z.enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive']),
  climate: z.string().min(1, "Iklim diperlukan."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsClient() {
  const { settings, updateSettings, updateReminders, isLoading } = useHydration();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [age, setAge] = useState<number | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });
  
  useEffect(() => {
    form.reset(settings);
    if (settings.dob) {
      try {
        const birthDate = parseISO(settings.dob);
        const calculatedAge = differenceInYears(new Date(), birthDate);
        setAge(calculatedAge);
      } catch (e) {
        setAge(null);
      }
    }
  }, [settings, form]);

  const onSubmit: SubmitHandler<SettingsFormValues> = (data) => {
    updateSettings(data);
    toast({
      title: "Pengaturan Disimpan",
      description: "Pengaturan baru Anda telah diterapkan.",
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
                title: "Pengingat Dihasilkan!",
                description: `Berhasil membuat ${result.reminders.length} pengingat cerdas.`,
            });
        } else {
            throw new Error("Tidak ada pengingat yang dihasilkan.");
        }
    } catch (error) {
        console.error("Gagal menghasilkan pengingat:", error);
        toast({
            variant: "destructive",
            title: "Gagal Menghasilkan",
            description: "Tidak dapat menghasilkan pengingat cerdas. Silakan coba lagi.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("profilePhoto", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div>Memuat pengaturan...</div>;
  }
  
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Sesuaikan profil, target hidrasi, dan preferensi pengingat Anda.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-primary" />
                Profil Pengguna
              </CardTitle>
              <CardDescription>
                Informasi ini membantu mempersonalisasi pengalaman Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={form.watch("profilePhoto")} />
                  <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                   <Camera className="mr-2 h-4 w-4" />
                   Ganti Foto
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>

               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} onChange={(e) => {
                          field.onChange(e);
                          try {
                              const birthDate = parseISO(e.target.value);
                              const calculatedAge = differenceInYears(new Date(), birthDate);
                              setAge(calculatedAge >= 0 ? calculatedAge : null);
                          } catch {
                              setAge(null);
                          }
                      }} />
                    </FormControl>
                    {age !== null && <FormDescription>Usia Anda: {age} tahun</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tinggi Badan (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berat Badan (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis kelamin Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Pria</SelectItem>
                          <SelectItem value="female">Wanita</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                          <SelectItem value="preferNotToSay">Tidak ingin menyebutkan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-primary" />
                Target Hidrasi
              </CardTitle>
              <CardDescription>
                Atur target asupan air harian pribadi Anda dan detail gaya hidup lainnya.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="dailyGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Harian (ml)</FormLabel>
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
                      <FormLabel>Waktu Bangun</FormLabel>
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
                      <FormLabel>Waktu Tidur</FormLabel>
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
                      <FormLabel>Tingkat Aktivitas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tingkat aktivitas Anda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentari (sedikit atau tanpa olahraga)</SelectItem>
                          <SelectItem value="lightlyActive">Aktivitas Ringan (olahraga ringan 1-3 hari/minggu)</SelectItem>
                          <SelectItem value="moderatelyActive">Aktivitas Sedang (olahraga sedang 3-5 hari/minggu)</SelectItem>
                          <SelectItem value="veryActive">Sangat Aktif (olahraga berat 6-7 hari seminggu)</SelectItem>
                          <SelectItem value="extraActive">Ekstra Aktif (olahraga sangat berat & pekerjaan fisik)</SelectItem>
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
                      <FormLabel>Iklim Anda</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Panas dan kering" {...field} />
                      </FormControl>
                      <FormDescription>Jelaskan iklim tempat Anda saat ini.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>
          <Button type="submit">Simpan Pengaturan</Button>
        </form>
      </Form>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-accent" />
            Pengingat Cerdas
          </CardTitle>
          <CardDescription>
            Gunakan AI untuk membuat jadwal pengingat yang dipersonalisasi berdasarkan pengaturan Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateReminders} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {isGenerating ? "Menghasilkan..." : "Hasilkan Pengingat AI"}
          </Button>

          <h3 className="font-semibold pt-4">Pengingat Anda</h3>
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
              Tidak ada pengingat yang ditetapkan. Hasilkan beberapa pengingat cerdas atau tambahkan secara manual.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
