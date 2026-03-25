const DATA_URL = "data/sa-funds.json";
const GROSS_RETURN = 0.08;
const HIGH_FEE_THRESHOLD = 0.02;

const fundInput = document.getElementById("fundInput");
const amountInput = document.getElementById("amountInput");
const advisorInput = document.getElementById("advisorInput");
const results = document.getElementById("results");
const copySummaryBtn = document.getElementById("copySummary");
const shareWhatsapp = document.getElementById("shareWhatsapp");
const shareTwitter = document.getElementById("shareTwitter");
const suggestionsBox = document.getElementById("fundSuggestions");

let funds = [];

fetch(DATA_URL)
  .then((res) => res.json())
  .then((data) => {
    funds = data.funds || [];
  })
  .catch(() => {
    results.innerHTML = '<p class="notice">Fund database failed to load.</p>';
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

const findCheapestAlternative = (fund) => {
  let alternatives = [];
  if (fund.cheaperAlternatives && fund.cheaperAlternatives.length) {
    alternatives = fund.cheaperAlternatives
      .map((altName) => funds.find((f) => f.name === altName))
      .filter(Boolean);
  }

  if (!alternatives.length) {
    alternatives = funds.filter((f) => f.category === fund.category && f.name !== fund.name);
  }

  if (!alternatives.length) return null;
  return alternatives.sort((a, b) => a.ter - b.ter)[0];
};

const buildShareText = ({ fund, amount, totalFeeRate, cost20 }) =>
  `Costra RipOff Radar™\nFund: ${fund.name}\nAmount: ${currency(amount)}\nAll-in fee: ${percent(totalFeeRate)}\n20yr fee drag: ${currency(cost20)}\nCheck yours: https://costra.co.za/fee-checker.html`;

const renderResults = ({ fund, amount, advisorFee }) => {
  const totalFeeRate = fund.ter + advisorFee;
  const annualFees = amount * totalFeeRate;

  const cost10 = feeImpact(amount, totalFeeRate, 10);
  const cost20 = feeImpact(amount, totalFeeRate, 20);
  const cost30 = feeImpact(amount, totalFeeRate, 30);

  const cheapest = findCheapestAlternative(fund);
  const cheapestFeeRate = cheapest ? cheapest.ter : null;
  const cheapestCost20 = cheapest ? feeImpact(amount, cheapestFeeRate, 20) : null;

  const maxCost = Math.max(cost10, cost20, cost30);
  const barWidth = (value) => `${Math.max((value / maxCost) * 100, 6).toFixed(0)}%`;

  const shareText = buildShareText({ fund, amount, totalFeeRate, cost20 });
  copySummaryBtn.dataset.summary = shareText;
  shareWhatsapp.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  const ombudCta = totalFeeRate >= HIGH_FEE_THRESHOLD
    ? `<a class="btn" href="ombud.html">Complain to Ombud</a>`
    : `<span class="notice">Your fee is below 2%. Still compare alternatives.</span>`;

  results.innerHTML = `
    <div class="share-card">
      <p class="section-label">Your result</p>
      <h3>${fund.name}</h3>
      <p>${fund.provider} · ${fund.category}</p>
      <div class="grid" style="margin-top: 12px;">
        <div>All-in fee: <span class="highlight">${percent(totalFeeRate)}</span></div>
        <div>Annual fee cost: <span class="highlight">${currency(annualFees)}</span></div>
        <div>20-year fee drag: <span class="highlight">${currency(cost20)}</span></div>
      </div>
    </div>
    <div class="card">
      <h3>Fee drag over time</h3>
      <div class="bar-chart" style="margin-top: 10px;">
        <div>10 years: ${currency(cost10)}</div>
        <div class="bar"><span style="width: ${barWidth(cost10)}"></span></div>
        <div>20 years: ${currency(cost20)}</div>
        <div class="bar"><span style="width: ${barWidth(cost20)}"></span></div>
        <div>30 years: ${currency(cost30)}</div>
        <div class="bar"><span style="width: ${barWidth(cost30)}"></span></div>
      </div>
    </div>
    ${cheapest ? `
    <div class="card comparison">
      <h3>Compare with the cheapest alternative</h3>
      <div class="grid grid-2">
        <div class="notice">
          <strong>Your fund</strong><br />
          ${fund.name}<br />
          TER: ${percent(fund.ter)}
        </div>
        <div class="notice">
          <strong>Cheapest alternative</strong><br />
          ${cheapest.name}<br />
          TER: ${percent(cheapestFeeRate)}
        </div>
      </div>
      <div class="notice">Potential 20-year saving: <strong>${currency(Math.max(cost20 - cheapestCost20, 0))}</strong></div>
    </div>
    ` : ""}
    <div class="card">
      <h3>Next steps</h3>
      <div class="cta-row" style="margin-top: 12px;">
        ${ombudCta}
        <a class="btn btn-outline" href="calculators.html">Check fee impact</a>
      </div>
    </div>
  `;
};

const form = document.getElementById("feeForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fund = findFund(fundInput.value.trim());
  const amount = parseFloat(amountInput.value);
  const advisorFee = parseFloat(advisorInput.value || "0") / 100;

  if (!fund) {
    results.innerHTML = '<p class="notice">Fund not found. Please pick a fund from the list.</p>';
    return;
  }

  if (!amount || amount <= 0) {
    results.innerHTML = '<p class="notice">Enter a valid amount invested.</p>';
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

const updateSuggestions = () => {
  const query = fundInput.value.trim().toLowerCase();
  if (!query || !funds.length) {
    suggestionsBox.hidden = true;
    return;
  }

  const matches = funds
    .filter((fund) => fund.name.toLowerCase().includes(query))
    .slice(0, 6);

  if (!matches.length) {
    suggestionsBox.hidden = true;
    return;
  }

  suggestionsBox.innerHTML = matches
    .map((fund) => `<div class="suggestion-item" data-name="${fund.name}">${fund.name}</div>`)
    .join("");
  suggestionsBox.hidden = false;
};

fundInput.addEventListener("input", updateSuggestions);

suggestionsBox.addEventListener("click", (event) => {
  const item = event.target.closest(".suggestion-item");
  if (!item) return;
  fundInput.value = item.dataset.name;
  suggestionsBox.hidden = true;
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".suggestions")) {
    suggestionsBox.hidden = true;
  }
});
