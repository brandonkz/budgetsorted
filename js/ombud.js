const form = document.getElementById("ombudForm");
const results = document.getElementById("ombudResults");

const buildComplaint = ({ name, email, advisor, fsp, product, date }) => {
  return `To: FAIS Ombud\n\nSubject: Complaint about undisclosed/excessive fees\n\nI, ${name}, hereby submit a complaint against ${advisor}${fsp ? ` (FSP ${fsp})` : ""}.\n\nSummary:\n- Product/Fund: ${product || "[Product/Fund]"}\n- Issue discovered: ${date || "[Date]"}\n- I requested clear disclosure of all fees (management, platform, advisor, and performance fees) and received inadequate or unclear information.\n- I believe the ongoing fees are excessive and not aligned with the services provided.\n\nRelief requested:\n1) Full written fee disclosure (all-in, in % and Rands).\n2) Evidence of services delivered for ongoing fees.\n3) Refund of unreasonable fees where applicable.\n\nI am available at ${email} for follow-up.\n\nRegards,\n${name}`;
};

const buildDisclosure = ({ name, email, advisor, fsp, product }) => {
  return `Subject: Request for full fee disclosure\n\nHello ${advisor},\n\nPlease provide a complete fee disclosure for my investment${product ? ` in ${product}` : ""}. This should include:\n- Total Expense Ratio (TER)\n- All-in fee (including advice and platform fees)\n- Any performance fees\n- Rand value of fees for the last 12 months\n- Confirmation of your ongoing service and its cost\n\nIf you are a registered FSP, please confirm your FSP number${fsp ? ` (currently recorded as ${fsp})` : ""}.\n\nRegards,\n${name}\n${email}`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    name: document.getElementById("clientName").value.trim(),
    email: document.getElementById("clientEmail").value.trim(),
    advisor: document.getElementById("advisorName").value.trim(),
    fsp: document.getElementById("fspNumber").value.trim(),
    product: document.getElementById("productName").value.trim(),
    date: document.getElementById("issueDate").value,
  };

  const complaint = buildComplaint(payload);
  const disclosure = buildDisclosure(payload);

  results.innerHTML = `
    <div class="notice">
      <strong>Complaint letter (copy + paste)</strong>
      <textarea class="input" style="height: 240px; margin-top: 10px;">${complaint}</textarea>
    </div>
    <div class="notice">
      <strong>Fee disclosure email</strong>
      <textarea class="input" style="height: 200px; margin-top: 10px;">${disclosure}</textarea>
    </div>
  `;
});
