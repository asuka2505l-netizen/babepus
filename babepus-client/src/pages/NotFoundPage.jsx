import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

const NotFoundPage = () => (
  <div className="min-h-screen bg-page px-4 py-16">
    <div className="mx-auto max-w-3xl">
      <EmptyState
        title="Halaman tidak ditemukan"
        description="Rute yang Anda akses tidak tersedia di BabePus."
        action={
          <Link to="/marketplace">
            <Button>Kembali ke Marketplace</Button>
          </Link>
        }
      />
    </div>
  </div>
);

export default NotFoundPage;
