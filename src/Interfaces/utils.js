// src/Interfaces/utils.js

export const formatDuration = (minutes) => {
  if (minutes === 0) return "0 dk";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} dk`;
  if (mins === 0) return `${hours}s`;
  return `${hours}s ${mins}dk`;
};

export const formatCurrency = (amount) => {
  return amount.toLocaleString("tr-TR") + " ₺";
};

export const formatDate = (dateStr) => {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};
