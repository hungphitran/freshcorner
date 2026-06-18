import { Search, ChevronDown, Tag } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/api';

export default function SearchBar() {
  const selectClass = "w-full text-left flex items-center justify-between appearance-none rounded-xl border border-secondary-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-secondary-800 hover:border-primary-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm transition-all duration-200 cursor-pointer";
  const inputClass = "w-full rounded-xl border border-secondary-200 bg-white py-3 pl-11 pr-4 text-sm text-secondary-800 hover:border-primary-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm transition-all duration-200";
  const iconClass = "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 transition-colors group-focus-within:text-primary-500 group-active-within:text-primary-500";

  const router = useRouter();

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Custom dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories', { params: { isActive: true, limit: 1000 } });
        if (res.data.success) {
          setCategories(res.data.categories || res.data.data || []);
        }
      } catch {
        // ignore error
      }
    })();
  }, []);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query: Record<string, string> = {};
    if (searchTerm.trim()) query.search = searchTerm.trim();
    if (selectedCategory) query.category = selectedCategory;
    router.push({ pathname: '/products', query });
  };

  const selectedCategoryName = categories.find(c => (c.slug === selectedCategory || c._id === selectedCategory))?.name || "Tất cả danh mục";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8  md:-mt-20 relative z-30">
      <div className="rounded-xl bg-white p-6 md:p-8 shadow-2xl shadow-brown-900/10 border border-brown-100 relative">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary-500 via-orange-500 to-brown-600" />
        <h2 className="text-xl font-bold text-secondary-900 mb-6 text-center md:text-left">
          Tìm món tươi ngon cho hôm nay
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Custom Dropdown */}
          <div className="relative group" ref={dropdownRef}>
            <label className="sr-only">Danh mục</label>
            <Tag className={iconClass} />
            
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`${selectClass} ${isOpen ? 'border-primary-500 ring-4 ring-primary-500/10' : ''}`}
            >
              <span>{selectedCategoryName}</span>
              <ChevronDown className={`h-5 w-5 text-secondary-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-secondary-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden transition-all duration-200 origin-top transform scale-y-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${!selectedCategory ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-secondary-700'}`}
                >
                  Tất cả danh mục
                </button>
                {categories.map(category => {
                  const val = category.slug || category._id;
                  const isSel = selectedCategory === val;
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(val);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${isSel ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-secondary-700'}`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative group">
            <label htmlFor="keyword" className="sr-only">Từ khóa</label>
            <Search className={iconClass} />
            <input
              id="keyword"
              type="text"
              className={inputClass}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm xoài, croissant, granola..."
            />
          </div>

          {/* Submit */}
          <button type="submit" className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-700 hover:scale-105 active:scale-100 disabled:opacity-50" disabled={!searchTerm.trim() && !selectedCategory}>
            <Search className="h-5 w-5" />
            <span>Tìm kiếm</span>
          </button>
        </form>
      </div>
    </div>
  );
}