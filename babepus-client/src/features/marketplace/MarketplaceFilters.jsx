import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const MarketplaceFilters = ({ categories, filters, onChange, onReset }) => (
  <aside className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft lg:sticky lg:top-24 lg:h-fit">
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-black text-slate-950">Filter</h2>
      <Button variant="ghost" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
    <div className="mt-4 grid gap-4">
      <Input
        label="Search realtime"
        placeholder="Cari buku, laptop, meja..."
        value={filters.search}
        onChange={(event) => onChange("search", event.target.value)}
      />
      <Select
        label="Kategori"
        value={filters.categoryId}
        onChange={(event) => onChange("categoryId", event.target.value)}
      >
        <option value="">Semua kategori</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min harga"
          min="0"
          type="number"
          value={filters.minPrice}
          onChange={(event) => onChange("minPrice", event.target.value)}
        />
        <Input
          label="Max harga"
          min="0"
          type="number"
          value={filters.maxPrice}
          onChange={(event) => onChange("maxPrice", event.target.value)}
        />
      </div>
      <Input
        label="Fakultas"
        placeholder="Contoh: Teknik, Ekonomi"
        value={filters.faculty}
        onChange={(event) => onChange("faculty", event.target.value)}
      />
      <Select label="Urutkan" value={filters.sort} onChange={(event) => onChange("sort", event.target.value)}>
        <option value="latest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="price_asc">Harga termurah</option>
        <option value="price_desc">Harga termahal</option>
      </Select>
    </div>
  </aside>
);

export default MarketplaceFilters;
