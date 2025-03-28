import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function SteelSonsLeaderboard() {
  const [mainData, setMainData] = useState([]);
  const [mastersData, setMastersData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYatcTXJ14AC6WIOeGrNtl09tcgxmklbEpiqZ4CVgNRxuDR4dGboKTEvC3T275C6W81ZFRaeo2Gc1N/pub?gid=1281963062&single=true&output=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: false });
        const rows = parsed.data;
        setMainData(rows.slice(0, 300));
        setSummaryData(rows.slice(1, 60).map((r) => r.slice(13, 15)));
        setMastersData(rows.slice(1, 12).map((r) => r.slice(17, 18)));
        setLastUpdated(new Date().toLocaleTimeString());
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYatcTXJ14AC6WIOeGrNtl09tcgxmklbEpiqZ4CVgNRxuDR4dGboKTEvC3T275C6W81ZFRaeo2Gc1N/pub?gid=1281963062&single=true&output=csv"
      )
        .then((res) => res.text())
        .then((text) => {
          const parsed = Papa.parse(text, { header: false });
          const rows = parsed.data;
          setMainData(rows.slice(0, 300));
          setSummaryData(rows.slice(1, 60).map((r) => r.slice(13, 15)));
          setMastersData(rows.slice(1, 12).map((r) => r.slice(17, 18)));
          setLastUpdated(new Date().toLocaleTimeString());
        });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 relative" style={{ fontFamily: 'Inter' }}>
      {/* Header */}
      <div className="text-center mb-4 z-10">
        <h1 className="text-4xl font-extrabold text-yellow-600 drop-shadow-lg">2025 Steel Sons Masters Pool</h1>
        <p className="text-md italic text-gray-700 mt-1">"You can lead a horse to the stable, but you can't make him drink water from the bowl!"</p>
        <p className="text-xs mt-2 text-gray-600">Last updated: {lastUpdated}</p>
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
            <tbody>
              {mainData.map((row, i) => (
                <tr key={i} className="even:bg-white/20">
                  {row.slice(0, 12).map((cell, j) => (
                    <td
                      key={j}
                      className="px-2 py-1 text-center border border-gray-400"
                      style={{ fontWeight: i === 0 ? 'bold' : 'normal', backgroundColor: i === 0 ? '#f7f7f7' : 'transparent' }}
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
            <ul className="bg-white/30 rounded-xl p-3 space-y-1 border border-black">
              {mastersData.map((row, i) => (
                <li key={i} className="text-sm border-b border-gray-400 pb-1 text-center">{row[0]}</li>
              ))}
            </ul>
          </div>

          {/* Summary Leaderboard */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-yellow-600">Summary</h2>
            <ul className="bg-white/30 rounded-xl p-3 space-y-1 border border-black">
              {summaryData.map((row, i) => (
                <li key={i} className="text-sm border-b border-gray-400 pb-1 text-center">
                  {row[0]} — {row[1]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
