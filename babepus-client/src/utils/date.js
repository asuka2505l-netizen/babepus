export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(value))
    : "-";
