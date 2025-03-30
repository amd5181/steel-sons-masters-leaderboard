import { useEffect, useState, useRef } from "react";

export default function SteelSonsLeaderboard() {
  const [mainData, setMainData] = useState([]);
  const [mastersData, setMastersData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(20);

  const previousMainData = useRef([]);
  const previousMastersData = useRef([]);
  const previousSummaryData = useRef([]);

  const API_KEY = "AIzaSyC-0Zrg5OARvAqSmyK8P8lkJqVCccGjrF4";
  const SPREADSHEET_ID = "1wHB6gZhyRcGm8jy0w3ntt3cfgMjmX7QpVfP6RnWNhvY";
  const range = "Standings!A1:Z1000";
  const encodedRange = encodeURIComponent(range);

  const fetchData = () => {
    const url = https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY};

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
    <div className="min-h-screen w-full bg-cover bg-center p-2 sm:p-4 font-inter max-w-screen-2xl mx-auto">
      <div className="text-center mb-4 z-10">
        <h1 className={text-2xl sm:text-4xl font-extrabold drop-shadow-lg ${headerStyle}}>
          2025 Steel Sons Masters Pool
        </h1>
        <p className="text-sm sm:text-md italic text-gray-700 mt-1">
          "You can lead a horse to the stable, but you can't make him drink water from the bowl!"
        </p>
        <p className="text-xs mt-2 text-gray-600">
          Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s
        </p>
      </div>

      <div className="bridge-watermark"></div>
      <img src="/arnold-palmer.png" alt="Arnold Palmer" className="arnold-palmer" />

      <div className="flex flex-col lg:flex-row gap-4 w-full overflow-x-auto">
        {/* Real-Time Standings */}
        <div className="flex-1 min-w-0">
          <h2 className={text-xl sm:text-2xl font-bold mb-4 ${headerStyle}}>Real-Time Standings</h2>
          {mainData.length > 2 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white/30 rounded-xl border border-black">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    {mainData[1]?.slice(0, 12).map((_, j) => {
                      if (j === 6) {
                        return (
                          <th key="completed-header" colSpan={4} className="text-center font-bold border-b border-black border-r-2 border-black">
                            Completed Rounds
                          </th>
                        );
                      }
                      if (j === 10) {
                        return (
                          <th key="current-header" colSpan={2} className="text-center font-bold border-b border-black border-r-2 border-black">
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
                        className={px-2 py-1 font-bold text-center border-b border-black whitespace-nowrap ${[4, 5, 9].includes(j) ? "border-r-2 border-black" : ""}}
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
                      className={text-center ${
                        (i + 1) % 5 === 0 || i === mainData.length - 4 ? "border-b border-black" : ""
                      }}
                    >
                      {row.slice(0, 12).map((cell, j) => (
                        <td
                          key={j}
                          className={px-2 py-1 whitespace-nowrap ${[4, 5, 9].includes(j) ? "border-r-2 border-black" : ""}}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading Data...</p>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex flex-col w-full lg:max-w-sm space-y-6">
          <div className="overlay rounded-2xl border border-black p-4">
            <h2 className={text-lg sm:text-xl font-semibold mb-2 ${headerStyle}}>Masters Leaderboard</h2>
            <table className="w-full text-sm bg-white/30 rounded-xl border border-black">
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

          <div className="overlay rounded-2xl border border-black p-4">
            <h2 className={text-lg sm:text-xl font-semibold mb-2 ${headerStyle}}>Summary</h2>
            <table className="w-full text-sm bg-white/30 rounded-xl border border-black">
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
