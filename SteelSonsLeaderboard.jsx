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
    <div className="flex min-h-screen p-4 relative" style={{ fontFamily: 'Inter' }}>
      {/* Main Standings */}
      <div className="w-2/3 pr-4 overflow-auto overlay z-10">
        <h1 className="text-2xl font-bold mb-4 text-yellow-400">Steel Sons Standings</h1>
        <table className="w-full text-sm">
          <tbody>
            {mainData.map((row, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-yellow-400/10">
                {row.slice(0, 12).map((cell, j) => (
                  <td key={j} className="px-2 py-1">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Pane */}
      <div className="w-1/3 space-y-8 overlay z-10">
        {/* Masters Leaderboard */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-yellow-300">Masters Leaderboard</h2>
          <ul className="bg-black/50 rounded-xl p-3 space-y-1">
            {mastersData.map((row, i) => (
              <li key={i} className="text-sm border-b border-gray-700 pb-1">{row[0]}</li>
            ))}
          </ul>
        </div>

        {/* Summary Leaderboard */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-yellow-300">Summary</h2>
          <ul className="bg-black/50 rounded-xl p-3 space-y-1">
            {summaryData.map((row, i) => (
              <li key={i} className="text-sm border-b border-gray-700 pb-1">
                {row[0]} — {row[1]}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs mt-4 text-gray-300">Last updated: {lastUpdated}</p>
      </div>

      {/* Arnold Palmer Watermark */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Arnold_Palmer_by_Gage_Skidmore.jpg"
        alt="Arnold Palmer"
        className="arnold-watermark absolute bottom-4 right-4"
      />
    </div>
  );
}
