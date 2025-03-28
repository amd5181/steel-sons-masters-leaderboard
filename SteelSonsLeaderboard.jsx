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

  const fetchData = () => {
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSYatcTXJ14AC6WIOeGrNtl09tcgxmklbEpiqZ4CVgNRxuDR4dGboKTEvC3T275C6W81ZFRaeo2Gc1N/pub?gid=1281963062&single=true&output=csv&t=${Date.now()}`;

    fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: false });
        const rows = parsed.data;
        console.log("🔄 Full parsed CSV:", rows);

        const newMain = rows.slice(0, 300);
        const newMasters = rows.slice(1, 12).map((r) => r.slice(17, 19));
        const newSummary = rows.slice(1, 60).map((r) => r.slice(13, 16));

        // Compare before updating state
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
      });
  };

  useEffect(() => {
    fetchData();
    let countdown = 20;
    const intervalId = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        fetchData();
        countdown = 20;
      }
      setRefreshCountdown(countdown);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 relative" style={{ fontFamily: 'Inter' }}>
      {/* Header */}
      <div className="text-center mb-4 z-10">
        <h1 className="text-4xl font-extrabold text-yellow-600 drop-shadow-lg">2025 Steel Sons Masters Pool</h1>
        <p className="text-md italic text-gray-700 mt-1">"You can lead a horse to the stable, but you can't make him drink water from the bowl!"</p>
        <p className="text-xs mt-2 text-gray-600">Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s</p>
      </div>

      {/* Background visual elements */}
      <div className="bridge-watermark"></div>
      <img src="/arnold-palmer.png" alt="Arnold Palmer" className="arnold-palmer" />

      {/* Main layout */}
      <div className="flex flex-1 gap-4">
        {/* Main Standings */}
        <div className="w-2/3 overflow-auto overlay">
          <h2 className="text-2xl font-bold mb-4 text-yellow-700">Real-Time Standings</h2>
          <table className="w-full text-sm border border-black rounded-xl overflow-hidden">
            <thead>
              <tr>
                {mainData[1]?.slice(0, 12).map((cell, j) => (
                  <th key={j} className="px-2 py-1 font-bold text-center border-b-4 border-black bg-white/80">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mainData.slice(2).map((row, i) => (
                <tr
                  key={i}
                  className={`text-center ${((i + 1) % 5 === 0 || i === mainData.length - 3) ? 'border-b border-black' : ''}`}
                >
                  {row.slice(0, 12).map((cell, j) => (
                    <td
                      key={j}
                      className="px-2 py-1"
                      style={{ borderBottom: 'none' }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Pane */}
        <div className="w-1/3 overlay rounded-2xl border border-black p-4">
          {/* Masters Leaderboard */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-yellow-600">Masters Leaderboard</h2>
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

          {/* Summary Leaderboard */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-yellow-600">Summary</h2>
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
