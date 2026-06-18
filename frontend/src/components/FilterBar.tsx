import { useState, useEffect } from "react";
import api from "@/utils/api";
import { ChevronDown, Search } from "lucide-react";

interface Props {
  onSearch: (term: string) => void;
  onFilter: (filters: Record<string, string>) => void;
}

const FilterSelect = ({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) => (
  <div className="relative group">
    <select
      className="w-full appearance-none rounded-xl border border-secondary-200 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-secondary-800 hover:border-primary-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm transition-all duration-200 cursor-pointer"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 text-secondary-500 transition-colors group-focus-within:text-primary-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

export default function FilterBar({ onSearch, onFilter }: Props) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories", { params: { isActive: true, limit: 1000 } });
        if (res.data.success) {
          setCategories(res.data.categories || res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }
    fetchCategories();
  }, []);

  // no individual car model fetch needed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_repeat(4,_1fr)]">
      <div className="relative group">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-200 bg-white focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm transition-all duration-200 text-sm font-medium text-secondary-800"
        />
        <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-500" />
      </div>

      <FilterSelect
        onChange={(e) => handleFilterChange("category", e.target.value)}
        value={filters.category || ""}
      >
        <option value="">Danh mục</option>
        {categories.map((category) => (
          <option key={category._id} value={category.slug || category._id}>{category.name}</option>
        ))}
      </FilterSelect>

      {/* Sort By */}
      <FilterSelect
        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
        value={filters.sortBy || ""}
      >
        <option value="">Sắp xếp</option>
        <option value="price">Giá</option>
        <option value="name">Tên</option>
        <option value="createdAt">Mới nhất</option>
      </FilterSelect>

      {/* Sort Order */}
      <FilterSelect
        onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
        value={filters.sortOrder || ""}
      >
        <option value="desc">Giảm dần</option>
        <option value="asc">Tăng dần</option>
      </FilterSelect>

      <FilterSelect
        onChange={(e) => handleFilterChange("price", e.target.value)}
        value={filters.price || ""}
      >
        <option value="">Giá</option>
        <option value="0-300000">Dưới 300k</option>
        <option value="300000-500000">300k - 500k</option>
        <option value="500000-800000">500k - 800k</option>
        <option value="800000-Infinity">Trên 800k</option>
      </FilterSelect>
    </div>
  );
} 