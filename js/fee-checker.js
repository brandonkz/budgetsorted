const DATA_URL = "data/sa-funds.json";
const GROSS_RETURN = 0.08;

const fundInput = document.getElementById("fundInput");
const amountInput = document.getElementById("amountInput");
const advisorInput = document.getElementById("advisorInput");
const results = document.getElementById("results");
const datalist = document.getElementById("funds");
const copySummaryBtn = document.getElementById("copySummary");

let funds = [];

fetch(DATA_URL)
  .then((res) => res.json())
  .then((data) => {
    funds = data.funds || [];
    funds.forEach((fund) => {
      const option = document.createElement("option");
      option.value = fund.name;
      datalist.appendChild(option);
    });
  })
  .catch(() => {
    results.innerHTML = "<p class=\"notice\">Fund database failed to load.</p>";
  });

const currency = (value) =>
  value.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });

const percent = (value) => `${(value * 100).toFixed(2)}%`;

const compoundValue = (principal, rate, years) => principal * Math.pow(1 + rate, years);

const feeImpact = (principal, feeRate, years) => {
  const gross = compoundValue(principal, GROSS_RETURN, years);
  const net = compoundValue(principal, GROSS_RETURN - feeRate, years);
  return gross - net;
};

const findFund = (name) => funds.find((fund) => fund.name.toLowerCase() === name.toLowerCase());

const renderResults = ({ fund, amount, advisorFee }) => {
  const totalFeeRate = fund.ter + advisorFee;
  const annualFees = amount * totalFeeRate;

  const cost10 = feeImpact(amount, totalFeeRate, 10);
  const cost20 = feeImpact(amount, totalFeeRate, 20);
  const cost30 = feeImpact(amount, totalFeeRate, 30);

  let alternativesHtml = "<p class=\"notice\">No alternatives listed.</p>";
  if (fund.cheaperAlternatives && fund.cheaperAlternatives.length) {
    const alternatives = fund.cheaperAlternatives
      .map((altName) => funds.find((f) => f.name === altName))
      .filter(Boolean);

    alternativesHtml = `
      <table class="table">
        <thead><tr><th>Alternative</th><th>TER</th><th>Category</th></tr></thead>
        <tbody>
          ${alternatives
            .map(
              (alt) => `
            <tr>
              <td>${alt.name}</td>
              <td>${percent(alt.ter)}</td>
              <td>${alt.category}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  results.innerHTML = `
    <div class="notice">
      <strong>${fund.name}</strong> · ${fund.provider} · ${fund.category}
    </div>
    <div class="card">
      <div class="grid">
        <div>Estimated all-in fee: <span class="highlight">${percent(totalFeeRate)}</span></div>
        <div>Annual fee cost: <span class="highlight">${currency(annualFees)}</span></div>
        <div>10-year fee impact: <span class="highlight">${currency(cost10)}</span></div>
        <div>20-year fee impact: <span class="highlight">${currency(cost20)}</span></div>
        <div>30-year fee impact: <span class="highlight">${currency(cost30)}</span></div>
      </div>
    </div>
    <div>
      <h3>Cheaper alternatives</h3>
      ${alternativesHtml}
    </div>
    <div class="notice">
      You could save <strong>${currency(cost20 * 0.25)}</strong>+ over 20 years by lowering fees.
    </div>
  `;

  copySummaryBtn.dataset.summary = `BudgetSorted Fee Check\nFund: ${fund.name}\nAmount: ${currency(amount)}\nAll-in fee: ${percent(totalFeeRate)}\nAnnual fees: ${currency(annualFees)}\n10yr impact: ${currency(cost10)}\n20yr impact: ${currency(cost20)}\n30yr impact: ${currency(cost30)}`;
};

const form = document.getElementById("feeForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fund = findFund(fundInput.value.trim());
  const amount = parseFloat(amountInput.value);
  const advisorFee = parseFloat(advisorInput.value || "0") / 100;

  if (!fund) {
    results.innerHTML = "<p class=\"notice\">Fund not found. Please pick a fund from the list.</p>";
    return;
  }

  if (!amount || amount <= 0) {
    results.innerHTML = "<p class=\"notice\">Enter a valid amount invested.</p>";
    return;
  }

  renderResults({ fund, amount, advisorFee });
});

copySummaryBtn.addEventListener("click", () => {
  const summary = copySummaryBtn.dataset.summary;
  if (!summary) return;
  navigator.clipboard.writeText(summary);
  copySummaryBtn.textContent = "Copied!";
  setTimeout(() => (copySummaryBtn.textContent = "Copy summary"), 2000);
});
