// pages/index.js
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

// Fetching Google Sheets data
const fetchData = async () => {
  const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSYatcTXJ14AC6WIOeGrNtl09tcgxmklbEpiqZ4CVgNRxuDR4dGboKTEvC3T275C6W81ZFRaeo2Gc1N/pub?gid=1281963062&single=true&output=csv`;

  const res = await fetch(url);
  const text = await res.text();

  const parsed = Papa.parse(text, { header: false });
  const rows = parsed.data;

  const newMain = rows.slice(0, 300);
  const newMasters = rows.slice(1, 12).map((r) => r.slice(17, 19));
  const newSummary = rows.slice(1, 60).map((r) => r.slice(13, 16));

  return { newMain, newMasters, newSummary };
};

export default function Home({ mainData, mastersData, summaryData, lastUpdated }) {
  const [refreshCountdown, setRefreshCountdown] = useState(20);

  useEffect(() => {
    let countdown = 20;
    const intervalId = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        countdown = 20;
      }
      setRefreshCountdown(countdown);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 relative" style={{ fontFamily: "Inter" }}>
      <div className="text-center mb-4 z-10">
        <h1 className={`text-4xl font-extrabold drop-shadow-lg text-yellow-700`}>2025 Steel Sons Masters Pool</h1>
        <p className="text-md italic text-gray-700 mt-1">
          "You can lead a horse to the stable, but you can't make him drink water from the bowl!"
        </p>
        <p className="text-xs mt-2 text-gray-600">
          Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s
        </p>
      </div>

      <div className="flex flex-1 gap-4">
        <div className="w-2/3 overflow-auto">
          <h2 className="text-2xl font-bold mb-4 text-yellow-700">Real-Time Standings</h2>
          {mainData.length > 2 ? (
            <table className="w-full text-sm border border-black rounded-xl overflow-hidden">
              <thead>
                <tr>
                  {mainData[1]?.slice(0, 12).map((_, j) => {
                    if (j === 6) {
                      return (
                        <th key="completed-header" colSpan={4} className="text-center font-bold bg-white/80 border-b border-black border-r-2 border-black">
                          Completed Rounds
                        </th>
                      );
                    }
                    if (j === 10) {
                      return (
                        <th key="current-header" colSpan={2} className="text-center font-bold bg-white/80 border-b border-black border-r-2 border-black">
                          Current Round
                        </th>
                      );
                    }
                    return j < 6 ? <th key={j}></th> : null;
                  })}
                </tr>
                <tr>
                  {mainData[1]?.slice(0, 12).map((cell, j) => (
                    <th key={j} className="px-2 py-1 font-bold text-center border-b-4 border-black bg-white/80">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mainData.slice(2).map((row, i) => (
                  <tr key={i} className={`text-center ${((i + 1) % 5 === 0 || i === mainData.length - 4) ? 'border-b border-black' : ''}`}>
                    {row.slice(0, 12).map((cell, j) => (
                      <td key={j} className={`px-2 py-1 ${[4, 5, 9].includes(j) ? 'border-r-2 border-black' : ''}`} style={{ borderBottom: 'none' }}>
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
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const { newMain, newMasters, newSummary } = await fetchData();

  return {
    props: {
      mainData: newMain,
      mastersData: newMasters,
      summaryData: newSummary,
      lastUpdated: new Date().toLocaleTimeString(),
    },
    revalidate: 60, // Regenerate the page every 60 seconds
  };
}
