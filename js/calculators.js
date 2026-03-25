const formatCurrency = (value) =>
  value.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

const feeImpact = (principal, feeRate, years, grossReturn = 0.08) => {
  const gross = principal * Math.pow(1 + grossReturn, years);
  const net = principal * Math.pow(1 + grossReturn - feeRate, years);
  return gross - net;
};

const futureValueSeries = (monthly, annualRate, years) => {
  const r = Math.pow(1 + annualRate, 1 / 12) - 1;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
};

const setupTabs = () => {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });
};

const shareButtons = (summary) => `
  <div class="cta-row" style="margin-top: 14px;">
    <button class="btn btn-outline share-result" data-summary="${summary}">Share result</button>
    <a class="btn btn-ghost" href="fee-checker.html">Check fees</a>
  </div>
`;

const feeCalcBtn = document.getElementById("feeCalcBtn");
const feeImpactResult = document.getElementById("feeImpactResult");
feeCalcBtn.addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("feeAmount").value || 0);
  const rate = parseFloat(document.getElementById("feeRate").value || 0) / 100;
  const years = parseFloat(document.getElementById("feeYears").value || 0);

  const cost = feeImpact(amount, rate, years);
  const summary = `Costra Fee Impact: ${formatCurrency(cost)} lost over ${years} years at ${
    rate * 100
  }% fees.`;

  feeImpactResult.innerHTML = `
    <div class="share-card">
      <h3>Fee damage</h3>
      <p>At ${rate * 100}% total fees, you lose:</p>
      <div class="stat-value">${formatCurrency(cost)}</div>
      <p>in ${years} years.</p>
      ${shareButtons(summary)}
    </div>
  `;
});

const retCalcBtn = document.getElementById("retCalcBtn");
const retirementResult = document.getElementById("retirementResult");
retCalcBtn.addEventListener("click", () => {
  const monthly = parseFloat(document.getElementById("retMonthly").value || 0);
  const annualRate = parseFloat(document.getElementById("retReturn").value || 0) / 100;
  const years = parseFloat(document.getElementById("retYears").value || 0);

  const total = futureValueSeries(monthly, annualRate, years);
  const summary = `Costra Retirement: ${formatCurrency(total)} after ${years} years saving ${formatCurrency(
    monthly
  )}/mo at ${annualRate * 100}% return.`;

  retirementResult.innerHTML = `
    <div class="share-card">
      <h3>Projected retirement value</h3>
      <div class="stat-value">${formatCurrency(total)}</div>
      <p>after ${years} years of saving ${formatCurrency(monthly)} per month.</p>
      ${shareButtons(summary)}
    </div>
  `;
});

const potCalcBtn = document.getElementById("potCalcBtn");
const twoPotResult = document.getElementById("twoPotResult");
potCalcBtn.addEventListener("click", () => {
  const value = parseFloat(document.getElementById("potValue").value || 0);
  const salary = parseFloat(document.getElementById("potSalary").value || 0);
  const annualContribution = salary * 12 * 0.15;
  const savingsPot = value * 0.1 + annualContribution * 0.33;
  const summary = `Costra Two-Pot: Estimated savings pot ${formatCurrency(savingsPot)}.`;

  twoPotResult.innerHTML = `
    <div class="share-card">
      <h3>Estimated savings pot</h3>
      <div class="stat-value">${formatCurrency(savingsPot)}</div>
      <p>Assumes 10% seed capital + 1/3 of new contributions. Check your fund rules before withdrawing.</p>
      ${shareButtons(summary)}
    </div>
  `;
});

const compCalcBtn = document.getElementById("compCalcBtn");
const compoundResult = document.getElementById("compoundResult");
compCalcBtn.addEventListener("click", () => {
  const principal = parseFloat(document.getElementById("compPrincipal").value || 0);
  const monthly = parseFloat(document.getElementById("compMonthly").value || 0);
  const annualRate = parseFloat(document.getElementById("compReturn").value || 0) / 100;
  const years = parseFloat(document.getElementById("compYears").value || 0);

  const total = principal * Math.pow(1 + annualRate, years) + futureValueSeries(monthly, annualRate, years);
  const summary = `Costra Compound: ${formatCurrency(total)} after ${years} years.`;

  compoundResult.innerHTML = `
    <div class="share-card">
      <h3>Compound growth</h3>
      <div class="stat-value">${formatCurrency(total)}</div>
      <p>Starting with ${formatCurrency(principal)} and adding ${formatCurrency(monthly)} monthly.</p>
      ${shareButtons(summary)}
    </div>
  `;
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".share-result");
  if (!button) return;
  const summary = button.dataset.summary;
  if (!summary) return;

  if (navigator.share) {
    navigator.share({ title: "Costra Calculator", text: summary, url: "https://costra.co.za/calculators.html" });
    return;
  }
  navigator.clipboard.writeText(summary);
  button.textContent = "Copied!";
  setTimeout(() => (button.textContent = "Share result"), 2000);
});

setupTabs();
