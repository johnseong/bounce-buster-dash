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
      {/* Profile */}
      <div className="apple-card p-6 space-y-5">
        <h2 className="text-[15px] font-semibold text-foreground">Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[13px]">Display Name</Label>
            <Input placeholder="Your name" className="rounded-xl" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px]">Email</Label>
            <Input placeholder="you@example.com" className="rounded-xl" defaultValue="john@example.com" />
          </div>
        </div>
        <Button size="sm" className="rounded-xl">Save Changes</Button>
      </div>

      {/* Appearance */}
      <div className="apple-card p-6 space-y-5">
        <h2 className="text-[15px] font-semibold text-foreground">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-foreground">Dark Mode</p>
            <p className="text-[13px] text-muted-foreground">Toggle between light and dark themes</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Notifications */}
      <div className="apple-card p-6 space-y-5">
        <h2 className="text-[15px] font-semibold text-foreground">Notifications</h2>
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

      {/* Danger zone */}
      <div className="apple-card p-6 space-y-5">
        <h2 className="text-[15px] font-semibold text-destructive">Danger Zone</h2>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-foreground">Delete Account</p>
            <p className="text-[13px] text-muted-foreground">Permanently remove your account and all data</p>
          </div>
          <Button variant="destructive" size="sm" className="rounded-xl">Delete</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
