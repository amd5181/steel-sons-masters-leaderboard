import { useEffect, useState, useRef } from "react";

export default function SteelSonsLeaderboard() {
  const [mainData, setMainData] = useState([]);
  const [mastersData, setMastersData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(20);
  const [previousRanks, setPreviousRanks] = useState({});

  const previousMainData = useRef([]);
  const previousMastersData = useRef([]);
  const previousSummaryData = useRef([]);

  const API_KEY = "AIzaSyC-0Zrg5OARvAqSmyK8P8lkJqVCccGjrF4";
  const SPREADSHEET_ID = "1wHB6gZhyRcGm8jy0w3ntt3cfgMjmX7QpVfP6RnWNhvY";
  const range = "Standings!A1:Z1000";
  const encodedRange = encodeURIComponent(range);

  const fetchData = () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY}`;

    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API returned an error:", data.error.message);
          return;
        }
        const rows = data.values;
        if (!rows || rows.length === 0) {
          console.warn("No rows found in API response");
          return;
        }

        const newMain = rows.slice(0, 300);
        const newMasters = rows.slice(1, 12).map((r) => r.slice(17, 19));
        const newSummary = rows.slice(1, 60).map((r) => r.slice(13, 16));

        const newRanks = {};
        for (let i = 2; i < newMain.length; i++) {
          const place = newMain[i][0];
          const manager = newMain[i][1];
          if (place && manager) newRanks[manager] = place;
        }
        setPreviousRanks((prev) => ({ ...prev, ...newRanks }));

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

  const headerStyle = "text-yellow-700 text-shadow-black";

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 font-inter max-w-screen-2xl mx-auto bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/bridge.png)' }}>
      {/* Header section */}
      <div className="relative text-center mb-8 p-6 border-b-4 border-yellow-700 shadow-xl bg-opacity-80 bg-white/80 rounded-xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wide text-yellow-600 drop-shadow-xl uppercase">
          ⛳ Steel Sons Masters Pool 2025 ⛳
        </h1>
        <p className="text-sm sm:text-md italic mt-2 max-w-xl mx-auto">
          "You can lead a horse to the stable, but you can't make him drink water from the bowl!"
        </p>
        <p className="text-xs mt-2">Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s</p>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 w-full overflow-x-auto">
        <div className="flex-1 min-w-0">
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${headerStyle}`}>Real-Time Standings</h2>
          {mainData.length > 2 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white/30 rounded-xl border border-black">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    {mainData[1]?.slice(0, 12).map((_, j) => {
                      if (j === 6) return <th key={j} colSpan={4} className="text-center font-bold border-b border-black">Completed Rounds</th>;
                      if (j === 10) return <th key={j} colSpan={2} className="text-center font-bold border-b border-black">Current Round</th>;
                      return j < 6 ? <th key={j}></th> : null;
                    })}
                  </tr>
                  <tr>
                    {mainData[1]?.slice(0, 12).map((cell, j) => (
                      <th key={j} className="px-2 py-1 font-bold text-center border-b border-black whitespace-nowrap">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mainData.slice(2).map((row, i) => {
                    const manager = row[1];
                    const currentRank = parseInt(row[0]);
                    const previousRank = parseInt(previousRanks[manager]);
                    const delta = previousRank && currentRank ? currentRank - previousRank : 0;

                    const rowClass = `text-center hover:bg-yellow-100/60 ${
                      delta < 0 ? "bg-green-100" : delta > 0 ? "bg-red-100" : ""
                    }`;

                    return (
                      <tr key={i} className={rowClass}>
                        {row.slice(0, 12).map((cell, j) => (
                          <td key={j} className="px-2 py-1 whitespace-nowrap border-b border-gray-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading Data...</p>
          )}
        </div>

        <div className="flex flex-col w-full lg:max-w-sm space-y-6">
          <div className="rounded-2xl border border-black p-4 bg-white/30">
            <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${headerStyle}`}>Masters Leaderboard</h2>
            <table className="w-full text-sm">
              <tbody>
                {mastersData.map((row, i) => (
                  <tr key={i} className="text-center">
                    <td className="px-2 py-1 border-b border-gray-400 whitespace-nowrap">{row[0]}</td>
                    <td className="px-2 py-1 border-b border-gray-400 whitespace-nowrap">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-black p-4 bg-white/30">
            <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${headerStyle}`}>Summary</h2>
            <table className="w-full text-sm">
              <tbody>
                {summaryData.map((row, i) => (
                  <tr key={i} className="text-center">
                    <td className="px-2 py-1 border-b border-gray-400 whitespace-nowrap">{row[0]}</td>
                    <td className="px-2 py-1 border-b border-gray-400 whitespace-nowrap">{row[1]}</td>
                    <td className="px-2 py-1 border-b border-gray-400 whitespace-nowrap">{row[2]}</td>
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
