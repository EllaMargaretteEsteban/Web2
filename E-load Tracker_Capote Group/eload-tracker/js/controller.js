import {
  NETWORKS,
  state,
  loadState,
  addTopUp,
  addSale,
  editSale,
  deleteSale,
  deleteTopUp,
  calcProfit,
  getDashboard,
  getFilteredSales,
  getInsights,
  summarize,
  toCSV,
  setLowBalance,
  setDailyGoal,
  resetAll,
} from "./model.js";

import navView from "./views/NavView.js";
import pagesView from "./views/PagesView.js";
import dateView from "./views/DateView.js";
import alertView from "./views/AlertView.js";
import heroView from "./views/HeroView.js";
import summaryView from "./views/SummaryView.js";
import breakdownView from "./views/BreakdownView.js";
import recentView from "./views/RecentView.js";
import walletFormView from "./views/WalletFormView.js";
import saleFormView from "./views/SaleFormView.js";
import filterView from "./views/FilterView.js";
import saleListView from "./views/SaleListView.js";
import topUpListView from "./views/TopUpListView.js";
import settingsView from "./views/SettingsView.js";

const PAGE_IDS = ["home", "add", "history", "settings"];

let activePage = "home";
let editingSaleId = null;
let prefillNetwork = null;
let filters = { network: "All", period: "all" };

const renderSaleForm = (error = "", typed = null) => {
  const editingSale = state.sales.find(sale => sale.id === editingSaleId);
  const values = typed || editingSale || { network: prefillNetwork };

  saleFormView.render({
    networks: NETWORKS,
    values,
    isEditing: Boolean(editingSale),
    editingId: editingSale?.id ?? "",
    error,
    earn: calcProfit(values.amount, values.price),
  });
};

const renderApp = () => {
  const dashboard = getDashboard();
  const insights = getInsights();
  const filteredSales = getFilteredSales(filters);

  navView.render(activePage);
  dateView.render(new Date().toISOString());

  alertView.render(dashboard.wallet);
  heroView.render({ ...dashboard, networks: NETWORKS });
  summaryView.render(dashboard.totals);
  breakdownView.render(insights.networks);
  recentView.render(insights.recent);

  walletFormView.render({ balance: dashboard.totals.balance });
  renderSaleForm();

  filterView.render(filters, summarize(filteredSales), NETWORKS);
  saleListView.render(filteredSales);
  topUpListView.render(state.topUps);

  settingsView.render(state.settings);
};

const controlNavigate = page => {
  activePage = PAGE_IDS.includes(page) ? page : "home";
  history.replaceState(null, "", `#${activePage}`);
  navView.render(activePage);
  pagesView.scrollTo(activePage);
};

const controlScrollSpy = page => {
  if (page === activePage) return;

  activePage = page;
  history.replaceState(null, "", `#${activePage}`);
  navView.render(activePage);
};

const controlQuickSell = network => {
  editingSaleId = null;
  prefillNetwork = network;
  renderApp();
  controlNavigate("add");
};

const controlPreview = ({ amount, price }) => {
  saleFormView.showEarn(calcProfit(amount, price));
};

const controlAddTopUp = ({ amount }) => {
  const error = addTopUp(amount);

  if (error) {
    walletFormView.showError(error);
    return;
  }

  walletFormView.clearError();
  renderApp();
};

const controlDeleteTopUp = id => {
  const error = deleteTopUp(id);

  if (error) {
    alert(error);
    return;
  }

  renderApp();
};

const controlAddOrEditSale = saleData => {
  if (saleData.cancel) {
    editingSaleId = null;
    renderApp();
    return;
  }

  const error = saleData.id
    ? editSale(saleData.id, saleData)
    : addSale(saleData);

  if (error) {
    renderSaleForm(error, saleData);
    return;
  }

  editingSaleId = null;
  prefillNetwork = null;
  renderApp();
};

const controlDeleteSale = id => {
  const error = deleteSale(id);

  if (!error) {
    if (editingSaleId === id) editingSaleId = null;
    renderApp();
  }
};

const controlEditSale = id => {
  editingSaleId = id;
  renderApp();
  controlNavigate("add");
};

const controlFilter = newFilters => {
  filters = newFilters;
  renderApp();
};

const controlExport = () => {
  const sales = getFilteredSales(filters);

  if (!sales.length) {
    alert("There are no sales to export.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  filterView.download(toCSV(sales), `eload-sales-${today}.csv`);
};

const controlSaveSettings = ({ lowBalance, dailyGoal }) => {
  const error = setLowBalance(lowBalance) || setDailyGoal(dailyGoal);

  if (error) {
    alert(error);
    return;
  }

  renderApp();
};

const controlReset = () => {
  resetAll();
  editingSaleId = null;
  prefillNetwork = null;
  renderApp();
};

const init = () => {
  loadState();

  navView.addHandlerNavigate(controlNavigate);
  pagesView.addHandlerNavigate(controlNavigate);
  pagesView.addHandlerScroll(controlScrollSpy);
  heroView.addHandlerQuickSell(controlQuickSell);
  walletFormView.addHandlerAddTopUp(controlAddTopUp);
  saleFormView.addHandlerAddSale(controlAddOrEditSale);
  saleFormView.addHandlerPreview(controlPreview);
  saleListView.addHandlerDelete(controlDeleteSale);
  saleListView.addHandlerEdit(controlEditSale);
  topUpListView.addHandlerDelete(controlDeleteTopUp);
  filterView.addHandlerFilter(controlFilter);
  filterView.addHandlerExport(controlExport);
  settingsView.addHandlerSaveSettings(controlSaveSettings);
  settingsView.addHandlerReset(controlReset);

  const hash = location.hash.slice(1);
  activePage = PAGE_IDS.includes(hash) ? hash : "home";

  renderApp();
  if (activePage !== "home") pagesView.scrollTo(activePage);
};

init();
