const formatNumber = (
  num: number | bigint,
  options?: Intl.NumberFormatOptions
) => {
  const formatter = new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    ...options,
  });

  return formatter.format(num);
};

export default formatNumber;
