import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";

export default function SteelSonsLeaderboard() {
  const [mainData, setMainData] = useState([]);
  const [mastersData, setMastersData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(20);

  const previousMainData = useRef([]);
  const previousMastersData = useRef([]);
  const previousSummaryData = useRef([]);

  // Function to fetch data
  const fetchData = () => {
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSYatcTXJ14AC6WIOeGrNtl09tcgxmklbEpiqZ4CVgNRxuDR4dGboKTEvC3T275C6W81ZFRaeo2Gc1N/pub?output=csv&cacheBust=${Math.random()}`;

    fetch(url, {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache"
    // "Expires": "0"  <-- Remove this line
  }
})
      .then((res) => res.text())
      .then((text) => {
        console.log("📥 CSV response (preview):", text.slice(0, 200)); // TEMP debug
        const parsed = Papa.parse(text, { header: false });
        console.log("Parsed data:", parsed);
        const rows = parsed.data;

        if (!rows || rows.length === 0) {
          console.warn("No rows found in CSV");
          return;
        }

        const newMain = rows.slice(0, 300);
        const newMasters = rows.slice(1, 12).map((r) => r.slice(17, 19));
        const newSummary = rows.slice(1, 60).map((r) => r.slice(13, 16));

        const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

        if (!isEqual(previousMainData.current, newMain)) {
          previousMainData.current = newMain;
          setMainData(newMain);
        }
        if (!isEqual(previousMastersData.current, newMasters)) {
          previousMastersData.current = newMasters;
          setMastersData(newMasters);
        }
        if (!isEqual(previousSummaryData.current, newSummary)) {
          previousSummaryData.current = newSummary;
          setSummaryData(newSummary);
        }

        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((error) => {
        console.error("❌ Fetch error:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Initial data fetch on load
    let countdown = 20;
    const intervalId = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        fetchData(); // Fetch data every 20 seconds
        countdown = 20;
      }
      setRefreshCountdown(countdown);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const headerStyle = "text-yellow-700 text-shadow-black";

  return (
    <div className="flex flex-col min-h-screen p-4 relative" style={{ fontFamily: "Inter" }}>
      <div className="text-center mb-4 z-10">
        <h1 className={`text-4xl font-extrabold drop-shadow-lg ${headerStyle}`}>
          2025 Steel Sons Masters Pool
        </h1>
        <p className="text-md italic text-gray-700 mt-1">
          "You can lead a horse to the stable, but you can't make him drink water from the bowl!"
        </p>
        <p className="text-xs mt-2 text-gray-600">
          Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s
        </p>
      </div>

      <div className="bridge-watermark"></div>
      <img src="/arnold-palmer.png" alt="Arnold Palmer" className="arnold-palmer" />

      <div className="flex flex-1 gap-4">
        <div className="w-2/3 overflow-auto overlay">
          <h2 className={`text-2xl font-bold mb-4 ${headerStyle}`}>Real-Time Standings</h2>
          {mainData.length > 2 ? (
            <table className="w-full text-sm border border-black rounded-xl overflow-hidden">
              <thead>
                <tr>
                  {mainData[1]?.slice(0, 12).map((_, j) => {
                    if (j === 6) {
                      return (
                        <th
                          key="completed-header"
                          colSpan={4}
                          className="text-center font-bold bg-white/80 border-b border-black border-r-2 border-black"
                        >
                          Completed Rounds
                        </th>
                      );
                    }
                    if (j === 10) {
                      return (
                        <th
                          key="current-header"
                          colSpan={2}
                          className="text-center font-bold bg-white/80 border-b border-black border-r-2 border-black"
                        >
                          Current Round
                        </th>
                      );
                    }
                    return j < 6 ? <th key={j}></th> : null;
                  })}
                </tr>
                <tr>
                  {mainData[1]?.slice(0, 12).map((cell, j) => (
                    <th
                      key={j}
                      className={`px-2 py-1 font-bold text-center border-b-4 border-black bg-white/80 ${
                        [4, 5, 9].includes(j) ? "border-r-2 border-black" : ""
                      }`}
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mainData.slice(2).map((row, i) => (
                  <tr
                    key={i}
                    className={`text-center ${
                      (i + 1) % 5 === 0 || i === mainData.length - 4 ? "border-b border-black" : ""
                    }`}
                  >
                    {row.slice(0, 12).map((cell, j) => (
                      <td
                        key={j}
                        className={`px-2 py-1 ${[4, 5, 9].includes(j) ? "border-r-2 border-black" : ""}`}
                        style={{ borderBottom: "none" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading Data...</p>
          )}
        </div>

        <div className="w-1/3 overlay rounded-2xl border border-black p-4">
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-2 ${headerStyle}`}>Masters Leaderboard</h2>
            <table className="w-full text-sm bg-white/30 rounded-xl border border-black">
              <tbody>
                {mastersData.map((row, i) => (
                  <tr key={i} className="text-center">
                    <td className="px-2 py-1 border-b border-gray-400">{row[0]}</td>
                    <td className="px-2 py-1 border-b border-gray-400">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className={`text-xl font-semibold mb-2 ${headerStyle}`}>Summary</h2>
            <table className="w-full text-sm bg-white/30 rounded-xl border border-black">
              <tbody>
                {summaryData.map((row, i) => (
                  <tr key={i} className="text-center">
                    <td className="px-2 py-1 border-b border-gray-400">{row[0]}</td>
                    <td className="px-2 py-1 border-b border-gray-400">{row[1]}</td>
                    <td className="px-2 py-1 border-b border-gray-400">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
