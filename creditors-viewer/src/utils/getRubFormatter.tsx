export const getRubFormatter = () => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  });
};
