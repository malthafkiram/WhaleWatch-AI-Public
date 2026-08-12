/**
 * Helper pemformat harga kripto presisi tinggi adaptif
 * Mencegah pembulatan $0.00 pada koin berharga desimal kecil (misal $0.0044 atau $0.00001234)
 */
export const formatCryptoPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) return "$0.00";

  const num = Number(price);
  if (num === 0) return "$0.00";

  // Koin bernilai besar (>= 1 USD): 2 desimal (misal: $65,432.10 atau $145.50)
  if (Math.abs(num) >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  // Koin bernilai menengah/kecil (< 1 USD dan >= 0.0001 USD): 4 hingga 6 desimal (misal: $0.0044 atau $0.0524)
  if (Math.abs(num) >= 0.0001) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(num);
  }

  // Koin bernilai sangat mikro (< 0.0001 USD): hingga 8 desimal (misal: $0.00001234)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 6,
    maximumFractionDigits: 8,
  }).format(num);
};
