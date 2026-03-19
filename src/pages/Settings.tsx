import { DashboardLayout } from "@/components/DashboardLayout";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <DashboardLayout title="Settings">
      <h2 className="text-[20px] font-bold text-foreground">Settings</h2>

      <div className="asana-card p-6 space-y-5">
        <h3 className="text-[15px] font-semibold text-foreground">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[13px]">Display Name</Label>
            <Input placeholder="Your name" className="rounded-lg" defaultValue="Alex" />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px]">Email</Label>
            <Input placeholder="you@example.com" className="rounded-lg" defaultValue="alex@example.com" />
          </div>
        </div>
        <Button size="sm" className="rounded-lg">Save Changes</Button>
      </div>

      <div className="asana-card p-6 space-y-5">
        <h3 className="text-[15px] font-semibold text-foreground">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-foreground">Dark Mode</p>
            <p className="text-[13px] text-muted-foreground">Toggle between light and dark themes</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="asana-card p-6 space-y-5">
        <h3 className="text-[15px] font-semibold text-foreground">Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "Email Alerts", desc: "Receive alerts when bounce rate spikes" },
            { label: "Weekly Digest", desc: "Summary report every Monday" },
            { label: "Real-time Alerts", desc: "Instant notifications for anomalies" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-foreground">{item.label}</p>
                <p className="text-[13px] text-muted-foreground">{item.desc}</p>
              </div>
              <Switch />
            </div>
          ))}
        </div>
      </div>

      <div className="asana-card p-6 space-y-5">
        <h3 className="text-[15px] font-semibold text-destructive">Danger Zone</h3>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-foreground">Delete Account</p>
            <p className="text-[13px] text-muted-foreground">Permanently remove your account and all data</p>
          </div>
          <Button variant="destructive" size="sm" className="rounded-lg">Delete</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
