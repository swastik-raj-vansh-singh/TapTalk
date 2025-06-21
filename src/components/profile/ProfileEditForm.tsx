
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileEditFormProps {
  editForm: {
    name: string;
    bio: string;
    profile_image_url: string;
  };
  setEditForm: (form: any) => void;
  uploadedImageUrl: string;
}

export default function ProfileEditForm({
  editForm,
  setEditForm,
  uploadedImageUrl
}: ProfileEditFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <Input
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <Textarea
          value={editForm.bio}
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          placeholder="Tell us about yourself..."
          rows={3}
        />
      </div>
      {uploadedImageUrl && (
        <div className="text-sm text-green-600">
          ✓ New profile picture uploaded. Click Save to apply changes.
        </div>
      )}
    </div>
  );
}
