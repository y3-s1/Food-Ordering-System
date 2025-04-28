import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

type Props = {
  onSearch: (searchTerm: string, roleFilter: string) => void;
};

export default function UserSearchBar({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim(), roleFilter);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2 w-full md:w-1/2">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-gray-700"
        />
      </div>

      {/* Role Filter Dropdown */}
      <div className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2 w-full md:w-1/4">
        <FaFilter className="text-gray-400 mr-2" />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full outline-none text-gray-700 bg-white"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="restaurantOwner">Restaurant Owner</option>
          <option value="deliveryAgent">Delivery Agent</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition w-full md:w-auto"
      >
        Apply
      </button>
    </form>
  );
}
