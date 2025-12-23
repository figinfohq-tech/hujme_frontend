import { useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface NotificationDialogProps {
  package: {
    package_id: string;
    packageName: string;
    bookings: any[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationDialog = ({
  package: pkg,
  open,
  onOpenChange,
}: NotificationDialogProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();


  console.log("packages----->", pkg);
  

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("package_notifications")
        .insert({
          package_id: pkg.package_id,
          agent_id: user.id,
          title,
          message,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notification sent to ${pkg.bookings.length} customer(s)`,
      });

      setTitle("");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Package Notification</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {pkg?.packageName} • {98} customer(s)
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-title">Notification Title</Label>
            <Input
              id="notification-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Important Travel Update"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-message">Message</Label>
            <Textarea
              id="notification-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={6}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/1000 characters
            </p>
          </div>

          <div className="bg-accent/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="space-y-2">
              <p className="font-medium">{title || "Notification Title"}</p>
              <p className="text-sm text-muted-foreground">
                {message || "Your message will appear here..."}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || !title.trim() || !message.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            Send to All Customers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};