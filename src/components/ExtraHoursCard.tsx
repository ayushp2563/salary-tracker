import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { useSalaryEntries, SalaryEntry } from "@/hooks/useSalaryEntries";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export const ExtraHoursCard = () => {
  const { entries, updateEntry, deleteEntry } = useSalaryEntries();
  const [editingEntry, setEditingEntry] = useState<SalaryEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    extra_hours: '',
    description: '',
  });

  const extraHoursEntries = entries.filter(entry => entry.extra_hours && entry.extra_hours > 0);
  const totalExtraHours = extraHoursEntries.reduce((sum, entry) => sum + (entry.extra_hours || 0), 0);

  const handleEdit = (entry: SalaryEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.start_date,
      extra_hours: String(entry.extra_hours || 0),
      description: entry.description || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    const { error } = await updateEntry(editingEntry.id, {
      start_date: formData.date,
      end_date: formData.date,
      extra_hours: parseFloat(formData.extra_hours) || 0,
      description: formData.description,
    });

    if (!error) {
      toast({
        title: "Success",
        description: "Extra hours updated successfully",
      });
      setEditingEntry(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingEntryId) return;

    const { error } = await deleteEntry(deletingEntryId);

    if (!error) {
      toast({
        title: "Deleted",
        description: "Extra hours entry deleted",
      });
    }
    setDeletingEntryId(null);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Extra Hours Summary
          </CardTitle>
          <div className="text-3xl font-bold text-primary">
            {totalExtraHours.toFixed(1)} hrs
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {extraHoursEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 rounded-lg bg-muted/50 group"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {format(new Date(entry.start_date), "MMM dd, yyyy")}
                  </span>
                  {entry.description && (
                    <span className="text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">
                    {(entry.extra_hours || 0).toFixed(1)} hrs
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(entry)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => setDeletingEntryId(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {totalExtraHours === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No extra hours recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Extra Hours</DialogTitle>
            <DialogDescription>
              Update the extra hours entry details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_date">Date</Label>
              <Input
                id="edit_date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_extra_hours">Extra Hours</Label>
              <Input
                id="edit_extra_hours"
                type="number"
                step="0.5"
                min="0"
                value={formData.extra_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, extra_hours: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingEntry(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingEntryId} onOpenChange={(open) => !open && setDeletingEntryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Extra Hours</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this extra hours entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
