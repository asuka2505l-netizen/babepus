import Button from "./Button";

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft sm:flex-row">
      <p className="text-sm font-medium text-slate-500">
        Halaman {meta.page} dari {meta.totalPages} dengan {meta.total} produk
      </p>
      <div className="flex gap-2">
        <Button
          disabled={meta.page <= 1}
          variant="secondary"
          onClick={() => onPageChange(meta.page - 1)}
        >
          Sebelumnya
        </Button>
        <Button
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
