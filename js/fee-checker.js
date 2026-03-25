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
const pdfDropzone = document.getElementById("pdfDropzone");
const pdfInput = document.getElementById("pdfInput");
const pdfStatus = document.getElementById("pdfStatus");
const scanSummary = document.getElementById("scanSummary");
const aiKeyInput = document.getElementById("aiKey");
const aiEnable = document.getElementById("aiEnable");

let funds = [];

fetch(DATA_URL)
  .then((res) => res.json())
  .then((data) => {
    funds = data.funds || [];
  })
  .catch(() => {
    results.innerHTML = '<p class="notice">Fund database failed to load.</p>';
  });

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

if (aiKeyInput) {
  const savedKey = localStorage.getItem("costraOpenAiKey");
  if (savedKey) aiKeyInput.value = savedKey;
  aiKeyInput.addEventListener("input", () => {
    localStorage.setItem("costraOpenAiKey", aiKeyInput.value.trim());
  });
}

if (aiEnable) {
  const savedEnable = localStorage.getItem("costraEnableAi");
  if (savedEnable === "true") aiEnable.checked = true;
  aiEnable.addEventListener("change", () => {
    localStorage.setItem("costraEnableAi", aiEnable.checked ? "true" : "false");
  });
}

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

const providerPatterns = [
  { regex: /Allan\s*Gray/i, provider: "Allan Gray" },
  { regex: /Coronation/i, provider: "Coronation" },
  { regex: /Sanlam/i, provider: "Sanlam" },
  { regex: /Old\s*Mutual/i, provider: "Old Mutual" },
  { regex: /Ninety\s*One/i, provider: "Ninety One" },
  { regex: /Satrix/i, provider: "Satrix" },
  { regex: /10X/i, provider: "10X" },
  { regex: /PSG/i, provider: "PSG" },
  { regex: /Discovery/i, provider: "Discovery" },
  { regex: /Momentum/i, provider: "Momentum" },
  { regex: /Liberty/i, provider: "Liberty" },
  { regex: /Nedgroup/i, provider: "Nedgroup" }
];

const feePatterns = {
  ter: [
    /Total\s*Expense\s*Ratio[:\s]*(\d+\.?\d*)%/i,
    /TER[:\s]*(\d+\.?\d*)%/i,
    /Total\s*Investment\s*Charge[:\s]*(\d+\.?\d*)%/i,
    /TIC[:\s]*(\d+\.?\d*)%/i
  ],
  managementFee: [
    /Management\s*Fee[:\s]*(\d+\.?\d*)%/i,
    /Annual\s*Management\s*Charge[:\s]*(\d+\.?\d*)%/i,
    /AMC[:\s]*(\d+\.?\d*)%/i
  ],
  performanceFee: [/Performance\s*Fee[:\s]*(\d+\.?\d*)%/i],
  advisorFee: [
    /Adviser?\s*Fee[:\s]*(\d+\.?\d*)%/i,
    /Advisory\s*Fee[:\s]*(\d+\.?\d*)%/i,
    /Financial\s*Adviser?\s*Fee[:\s]*(\d+\.?\d*)%/i
  ],
  investmentValue: [
    /(?:Market|Investment|Portfolio|Total)\s*Value[:\s]*R?\s*([\d,]+\.?\d*)/i,
    /R\s*([\d,]+\.?\d*)\s*(?:invested|balance|value)/i
  ]
};

const extractNumber = (value) => parseFloat(value.replace(/,/g, ""));

const extractPatternValue = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return extractNumber(match[1]);
  }
  return null;
};

const detectProvider = (text) => {
  for (const entry of providerPatterns) {
    if (entry.regex.test(text)) return entry.provider;
  }
  return null;
};

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
};

const renderScanSummary = ({ providerName, scannedFunds }) => {
  if (!scanSummary) return;

  if (!scannedFunds.length) {
    scanSummary.innerHTML = '<p class="notice">We could not auto-detect any funds. Try entering them manually above, or enable AI scanning.</p>';
    scanSummary.hidden = false;
    return;
  }

  const summaryRows = scannedFunds.map((item, index) => {
    const amount = item.amount || 0;
    const advisorFeeRate = (item.advisorFee || 0) / 100;
    const ter = item.fundRef ? item.fundRef.ter : (item.ter || 0);
    const totalFeeRate = ter + advisorFeeRate;
    const annualFees = amount ? amount * totalFeeRate : 0;

    const cheapest = item.fundRef ? findCheapestAlternative(item.fundRef) : null;
    const potentialSaving = cheapest && amount
      ? Math.max((totalFeeRate - cheapest.ter) * amount, 0)
      : null;

    return `
      <div class="notice" style="margin-top: 12px;">
        <strong>${index + 1}. ${item.name}</strong>${amount ? ` — ${currency(amount)}` : ""}<br />
        ${item.ter ? `TER: ${item.ter}%` : ""}
        ${item.advisorFee ? ` | Advisor: ${item.advisorFee}%` : ""}
        ${totalFeeRate ? ` | Total: ${percent(totalFeeRate)}` : ""}<br />
        ${annualFees ? `Annual fees: ${currency(annualFees)}` : ""}
        ${cheapest ? `<br />Cheapest alternative: ${cheapest.name} (${percent(cheapest.ter)})` : ""}
        ${potentialSaving !== null ? `<br />Potential saving: ${currency(potentialSaving)}/year` : ""}
      </div>
    `;
  }).join("");

  const totalAmount = scannedFunds.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalFeesRate = scannedFunds.reduce((sum, item) => {
    const ter = item.fundRef ? item.fundRef.ter : (item.ter || 0);
    const advisorFeeRate = (item.advisorFee || 0) / 100;
    return sum + ter + advisorFeeRate;
  }, 0);
  const totalAnnualFees = totalAmount ? totalAmount * totalFeesRate : 0;

  scanSummary.innerHTML = `
    <p class="section-label">Statement analysis${providerName ? ` — ${providerName}` : ""}</p>
    <h3>Found ${scannedFunds.length} investment${scannedFunds.length === 1 ? "" : "s"}</h3>
    ${summaryRows}
    ${totalAmount ? `<div class="notice" style="margin-top: 16px;"><strong>Total portfolio:</strong> ${currency(totalAmount)}<br /><strong>Total annual fees:</strong> ${currency(totalAnnualFees)}</div>` : ""}
  `;
  scanSummary.hidden = false;
};

const parseStatementText = (text) => {
  const lowerText = text.toLowerCase();
  const providerName = detectProvider(text);

  const extractedFees = {
    ter: extractPatternValue(text, feePatterns.ter),
    managementFee: extractPatternValue(text, feePatterns.managementFee),
    performanceFee: extractPatternValue(text, feePatterns.performanceFee),
    advisorFee: extractPatternValue(text, feePatterns.advisorFee)
  };

  const investmentValue = extractPatternValue(text, feePatterns.investmentValue);

  const matchedFunds = funds.filter((fund) => lowerText.includes(fund.name.toLowerCase()));

  const scannedFunds = matchedFunds.map((fund) => ({
    name: fund.name,
    fundRef: fund,
    provider: fund.provider,
    category: fund.category,
    amount: investmentValue,
    ter: extractedFees.ter || null,
    managementFee: extractedFees.managementFee || null,
    performanceFee: extractedFees.performanceFee || null,
    advisorFee: extractedFees.advisorFee || null
  }));

  if (!scannedFunds.length && extractedFees.ter) {
    scannedFunds.push({
      name: providerName ? `${providerName} Fund` : "Unknown Fund",
      fundRef: null,
      provider: providerName || "Unknown",
      category: "unknown",
      amount: investmentValue,
      ter: extractedFees.ter,
      managementFee: extractedFees.managementFee || null,
      performanceFee: extractedFees.performanceFee || null,
      advisorFee: extractedFees.advisorFee || null
    });
  }

  return { providerName, scannedFunds, extractedFees };
};

const updatePdfStatus = (message) => {
  if (pdfStatus) {
    pdfStatus.textContent = message;
  }
};

const applyScanToForm = (scanData) => {
  if (!scanData.scannedFunds.length) return;
  const first = scanData.scannedFunds[0];

  if (first.fundRef) {
    fundInput.value = first.fundRef.name;
  } else {
    fundInput.value = first.name;
  }

  if (first.amount) {
    amountInput.value = Math.round(first.amount);
  }

  if (first.advisorFee) {
    advisorInput.value = first.advisorFee;
  }

  if (first.fundRef || first.ter) {
    const fundForRender = first.fundRef || {
      name: first.name,
      provider: first.provider || "Unknown",
      category: first.category || "unknown",
      ter: first.ter || 0
    };
    const amount = first.amount || parseFloat(amountInput.value || "0");
    if (amount) {
      renderResults({ fund: fundForRender, amount, advisorFee: (first.advisorFee || 0) / 100 });
    }
  }
};

const handlePdfFile = async (file) => {
  if (!file) return;
  if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
    updatePdfStatus("Please upload a PDF file.");
    return;
  }
  if (!window.pdfjsLib) {
    updatePdfStatus("PDF scanning is unavailable. Please refresh and try again.");
    return;
  }
  if (!funds.length) {
    updatePdfStatus("Fund database still loading. Please try again in a moment.");
    return;
  }

  updatePdfStatus(`Analysing ${file.name}...`);
  if (scanSummary) scanSummary.hidden = true;

  try {
    const text = await extractPdfText(file);
    const scanData = parseStatementText(text);

    const hasFees = scanData.scannedFunds.some(
      (item) => item.ter || item.managementFee || item.performanceFee || item.advisorFee
    );

    if (!scanData.scannedFunds.length || !hasFees) {
      updatePdfStatus(`We couldn't auto-detect your funds in ${file.name}. Try entering them manually above, or enable AI scanning.`);
      renderScanSummary({ providerName: scanData.providerName, scannedFunds: [] });
      return;
    }

    updatePdfStatus(`✅ ${file.name} — Found ${scanData.scannedFunds.length} investment${scanData.scannedFunds.length === 1 ? "" : "s"}.`);
    renderScanSummary(scanData);
    applyScanToForm(scanData);
  } catch (error) {
    updatePdfStatus("Something went wrong while reading your PDF. Please try again.");
  }
};

if (pdfDropzone && pdfInput) {
  const preventDefaults = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    pdfDropzone.addEventListener(eventName, preventDefaults, false);
  });

  pdfDropzone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    handlePdfFile(file);
  });

  pdfDropzone.addEventListener("click", () => {
    pdfInput.click();
  });

  pdfDropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pdfInput.click();
    }
  });

  pdfInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    handlePdfFile(file);
  });
}

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
