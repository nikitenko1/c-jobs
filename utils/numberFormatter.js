// In basic use without specifying a locale

export const toCurrency = (amount) => {
  let formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(amount).toString();
};
