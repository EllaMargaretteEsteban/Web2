const STORAGE_KEY = "eload-tracker-v1";

export const NETWORKS = ["Globe", "Smart", "TNT", "DITO"];

const DEFAULT_SETTINGS = { lowBalance: 100, dailyGoal: 120 };

export const state = {
  topUps: [],
  sales: [],
  settings: { ...DEFAULT_SETTINGS },
};

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Could not save data:", err);
  }
};

export const loadState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      state.topUps = Array.isArray(saved.topUps) ? saved.topUps : [];
      state.sales = Array.isArray(saved.sales) ? saved.sales : [];
      state.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
    }
  } catch (err) {
    console.error("Could not load data:", err);
  }
};

const createId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);

export const getTotals = () => {
  const capital = sum(state.topUps, "amount");
  const sales = sum(state.sales, "price");
  const cost = sum(state.sales, "amount");

  return {
    capital,
    sales,
    profit: sales - cost,
    balance: capital - cost,
  };
};

const validateSale = ({ network, amount, price }, ignoreId = null) => {
  if (!NETWORKS.includes(network)) return "Please choose a network.";
  if (!Number.isFinite(amount) || amount <= 0)
    return "Wallet cost must be greater than 0.";
  if (!Number.isFinite(price) || price <= 0)
    return "Selling price must be greater than 0.";

  const otherCost = sum(
    state.sales.filter(sale => sale.id !== ignoreId),
    "amount"
  );
  const available = getTotals().capital - otherCost;

  if (amount > available)
    return "Not enough wallet balance for this sale.";

  return "";
};

export const addTopUp = amount => {
  if (!Number.isFinite(amount) || amount <= 0)
    return "Top-up amount must be greater than 0.";

  state.topUps.push({
    id: createId(),
    amount,
    date: new Date().toISOString(),
  });
  persist();
  return "";
};

export const addSale = ({ network, amount, price }) => {
  const error = validateSale({ network, amount, price });
  if (error) return error;

  state.sales.push({
    id: createId(),
    network,
    amount,
    price,
    date: new Date().toISOString(),
  });
  persist();
  return "";
};

export const editSale = (id, { network, amount, price }) => {
  const sale = state.sales.find(item => item.id === id);
  if (!sale) return "Sale not found.";

  const error = validateSale({ network, amount, price }, id);
  if (error) return error;

  sale.network = network;
  sale.amount = amount;
  sale.price = price;
  persist();
  return "";
};

export const deleteSale = id => {
  const index = state.sales.findIndex(item => item.id === id);
  if (index === -1) return "Sale not found.";

  state.sales.splice(index, 1);
  persist();
  return "";
};

export const deleteTopUp = id => {
  const index = state.topUps.findIndex(item => item.id === id);
  if (index === -1) return "Top-up not found.";

  const remainingCapital = getTotals().capital - state.topUps[index].amount;
  if (remainingCapital < sum(state.sales, "amount"))
    return "Can't delete this top-up: your wallet balance would go negative. Delete or edit some sales first.";

  state.topUps.splice(index, 1);
  persist();
  return "";
};

// ---------- Filters, insights, export, settings ----------

const inPeriod = (iso, period) => {
  const date = new Date(iso);
  const now = new Date();

  if (period === "today") return date.toDateString() === now.toDateString();
  if (period === "week") return now - date <= 7 * 24 * 60 * 60 * 1000;
  if (period === "month")
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  return true;
};

export const getFilteredSales = ({ network = "All", period = "all" } = {}) =>
  state.sales.filter(
    sale =>
      (network === "All" || sale.network === network) &&
      inPeriod(sale.date, period)
  );

export const summarize = sales => ({
  count: sales.length,
  sales: sum(sales, "price"),
  profit: sum(sales, "price") - sum(sales, "amount"),
});

const percent = (part, whole) =>
  whole > 0 ? Math.max(0, Math.min(100, Math.round((part / whole) * 100))) : 0;

export const calcProfit = (amount, price) =>
  Number.isFinite(amount) && Number.isFinite(price) ? price - amount : 0;

export const getInsights = () => {
  const networks = NETWORKS.map(network => ({
    network,
    ...summarize(state.sales.filter(sale => sale.network === network)),
  }));
  const best = Math.max(...networks.map(n => n.profit), 0);

  return {
    recent: [...state.sales].reverse().slice(0, 4),
    networks: networks.map(n => ({ ...n, share: percent(n.profit, best) })),
  };
};

export const getDashboard = () => {
  const totals = getTotals();
  const today = summarize(getFilteredSales({ period: "today" }));
  const { lowBalance, dailyGoal } = state.settings;

  let status = "healthy";
  if (!totals.capital) status = "empty";
  else if (lowBalance > 0 && totals.balance < lowBalance) status = "low";

  return {
    totals,
    today,
    wallet: {
      balance: totals.balance,
      threshold: lowBalance,
      percent: percent(totals.balance, totals.capital),
      status,
    },
    goal: { target: dailyGoal, percent: percent(today.profit, dailyGoal) },
  };
};

export const toCSV = sales => {
  const quote = value => `"${String(value).replace(/"/g, '""')}"`;
  const header = ["Date", "Network", "Wallet Cost", "Sold For", "Profit"];
  const rows = sales.map(sale =>
    [
      new Date(sale.date).toLocaleString("en-PH"),
      sale.network,
      sale.amount.toFixed(2),
      sale.price.toFixed(2),
      (sale.price - sale.amount).toFixed(2),
    ].map(quote)
  );

  return "\ufeff" + [header.map(quote), ...rows].map(r => r.join(",")).join("\n");
};

export const setLowBalance = value => {
  if (!Number.isFinite(value) || value < 0)
    return "Alert amount must be 0 or more.";

  state.settings.lowBalance = value;
  persist();
  return "";
};

export const setDailyGoal = value => {
  if (!Number.isFinite(value) || value < 0)
    return "Daily goal must be 0 or more.";

  state.settings.dailyGoal = value;
  persist();
  return "";
};

export const resetAll = () => {
  state.topUps = [];
  state.sales = [];
  persist();
};
