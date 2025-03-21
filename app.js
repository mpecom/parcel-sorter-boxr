const db = window._firebaseDb; // Our Firestore DB

// existing code:
const barcodeInput = document.getElementById("barcode-input");
const resultDiv = document.getElementById("result");

barcodeInput.addEventListener("change", handleScan);

async function handleScan() {
  const code = barcodeInput.value.trim();
  if (!code) return;

  resultDiv.textContent = `Scanned code: ${code}`;
  barcodeInput.value = "";

  // Save to Firestore (example: a "scans" collection)
  try {
    await addDoc(collection(db, "scans"), {
      trackingNumber: code,
      timestamp: Date.now()
    });
    console.log("Scan saved to Firestore!");
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
}
const carriers = [
  { name: "DHL", prefix: "0034", bin: "1050" },
  { name: "GLS", prefix: "8064", bin: "1070" },
  // etc...
];
function findCarrier(code) {
  return carriers.find(c => code.startsWith(c.prefix));
}

async function handleScan() {
  const code = barcodeInput.value.trim();
  if (!code) return;

  // Identify the carrier
  const carrier = findCarrier(code);
  if (!carrier) {
    resultDiv.textContent = "Unknown carrier!";
    return;
  }

  // Display bin info
  resultDiv.textContent = `Scanned code: ${code}, Carrier: ${carrier.name}, Bin: ${carrier.bin}`;

  // Save in Firestore
  try {
    await addDoc(collection(db, "scans"), {
      trackingNumber: code,
      carrier: carrier.name,
      bin: carrier.bin,
      timestamp: Date.now()
    });
    console.log("Scan saved to Firestore!");
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }

  // Clear
  barcodeInput.value = "";
}

import { onSnapshot, collection, orderBy, query } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// At the bottom, after everything
const scansList = document.getElementById("scans-list");

// Real-time listener to Firestore
const q = query(collection(db, "scans"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  // Clear the list
  scansList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `[${new Date(data.timestamp).toLocaleString()}] ${data.carrier} - ${data.trackingNumber} - Bin: ${data.bin}`;
    scansList.appendChild(li);
  });
});

