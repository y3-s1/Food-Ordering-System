import { useState } from "react";

type Props = {
  profile: {
    name: string;
    email: string;
    role: string;
    userId: string;
  };
  onUpdate: (updatedData: any) => void;
};

export default function ProfileForm({ profile, onUpdate }: Props) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Role (disabled field) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
        <input
          disabled
          value={profile.role}
          className="w-full border bg-gray-100 border-gray-300 p-3 rounded-lg cursor-not-allowed"
        />
      </div>

      {/* Save button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-bold transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
