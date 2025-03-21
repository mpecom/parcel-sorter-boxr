const barcodeInput = document.getElementById("barcode-input");
const resultDiv = document.getElementById("result");

barcodeInput.addEventListener("change", handleScan);

function handleScan() {
  const code = barcodeInput.value.trim();
  if (!code) return;

  // For now, just display the scanned code
  resultDiv.textContent = `Scanned code: ${code}`;

  // Clear the input
  barcodeInput.value = "";
}
