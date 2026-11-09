# E-load Tracker: Team Contributions

**Group:** Capote Group  
**Course:** ITPFE 1, Web Systems and Technologies 2 (ITBAN 3E)  
**Instructor:** Karlo Sasiang

Each member made real commits to this repository using their own GitHub account.

## Team and roles

| Member | Role | Feature owned |
|---|---|---|
| John Rey M. Capote | Group Leader | HeroView, SummaryView, WalletFormView, TopUpListView |
| **Crisel Joy A. Bonogan** | **Frontend Developer** | **Wallet top-ups and balance tracking** |
| Ella Margarette Q. Esteban | Functionality Tester | E-load sales and profit/loss tracking |

## What each member contributed

| Member | Contribution |
|---|---|
| John Rey M. Capote | HeroView.js (balance card and quick sell), SummaryView.js (capital, sales, profit), WalletFormView.js (top-up form), TopUpListView.js (top-up list) |
| **Crisel Joy A. Bonogan** | **NavView.js (menu), DateView.js (today's date), AlertView.js (low-balance warning), BreakdownView.js (profit by network), FilterView.js (filters and CSV export), style.css (pastel design)** |
| Ella Margarette Q. Esteban | PagesView.js (scroll between pages), RecentView.js (recent sales), SaleFormView.js (sale form and live profit), SaleListView.js (edit and delete sales), SettingsView.js (settings and reset) |

## Bonogan: file tracker

| File | What it does | Status |
|---|---|---|
| `js/views/NavView.js` | Builds the menu and sends the clicked page to the controller | ☐ Committed |
| `js/views/DateView.js` | Shows today's date at the top of Home | ☐ Committed |
| `js/views/AlertView.js` | Shows a warning when the wallet balance is low | ☐ Committed |
| `js/views/BreakdownView.js` | Shows profit per network (Globe, Smart, TNT, DITO) | ☐ Committed |
| `js/views/FilterView.js` | Filters sales by network and period, and exports CSV | ☐ Committed |
| `css/style.css` | Pastel colors and mobile-first layout | ☐ Committed |

Tick each box (change `☐` to `✅`) after you push that file.

## Commit tracker (5 or more commits per member)

| Member | GitHub username | Commits | Goal met? |
|---|---|---|---|
| John Rey M. Capote | | | ☐ |
| Crisel Joy A. Bonogan | | | ☐ |
| Ella Margarette Q. Esteban | | | ☐ |

Check the numbers in the repository under **Insights → Contributors**.

## Project structure

```
E-load-Tracker/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── model.js
    ├── controller.js
    └── views/
        ├── View.js
        └── (one file per view)
```
