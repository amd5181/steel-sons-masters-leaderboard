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
      {/* Fancy Header */}
      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-transparent bg-clip-text drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)] font-serif uppercase">
          Steel Sons Masters Pool
        </h1>

        <h2 className="text-xl sm:text-2xl font-semibold tracking-wider mt-1 font-mono text-gray-700 uppercase [text-shadow:1px_1px_0_#bbb]">
          2025
        </h2>

        <div className="flex justify-center mt-3">
          <img
            src="/ben.png"
            alt="Steel Beam"
            className="h-12 sm:h-16 w-80 sm:w-[30rem] object-contain drop-shadow-md animate-slide-in"
          />
        </div>

        <p className="text-md sm:text-lg italic text-gray-700 mt-4 font-light tracking-wide">
          "From Augusta National to the links at Manor Valley"
        </p>

        {/* Links: Signup + History */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 mb-4">
          <a
            href="https://script.google.com/macros/s/AKfycbwcmZ-2kmbVfMwPH2gjLxb0hD_Pe3eQ9R_ti55B1JivfrV3eFLb2AfUpS-8cZgoroqzVg/exec"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold px-4 py-2 rounded-full shadow transition"
          >
            📝 Sign Up for the 2025 Pool
          </a>

          <a
            href="/history.html"
  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-full shadow transition"
>
            🏆 View Pool History
          </a>
        </div>

        <p className="text-xs mt-2 text-gray-600 tracking-tight">
          Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s
        </p>
      </div>

      {/* Decorations */}
      <div className="bridge-watermark"></div>
      <img src="/arnold-palmer.png" alt="Arnold Palmer" className="arnold-palmer" />

      <div className="flex flex-col lg:flex-row gap-4 w-full overflow-x-auto">
        {/* Real-Time Standings */}
        <div className="flex-1 min-w-0">
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${headerStyle}`}>Real-Time Standings</h2>
          {mainData.length > 2 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white/30 rounded-xl border border-black overflow-hidden">
                <thead className="sticky top-0 bg-white/30 backdrop-blur-md z-10">
                  <tr>
                    {mainData[1]?.slice(0, 12).map((_, j) => {
                      if (j === 6) {
                        return (
                          <th
                            key="completed-header"
                            colSpan={4}
                            className="text-center font-bold border-b border-black border-r-2 border-black"
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
                            className="text-center font-bold border-b border-black border-r-2 border-black"
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
                        className={`px-2 py-1 font-bold text-center border-b border-black whitespace-nowrap 
                          ${[4, 5, 9].includes(j) ? "border-r-2 border-black" : ""}
                          ${j === 0 ? "rounded-tl-xl" : ""}
                          ${j === 11 ? "rounded-tr-xl" : ""}`}
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
                          className={`px-2 py-1 whitespace-nowrap 
                            ${[4, 5, 9].includes(j) ? "border-r-2 border-black" : ""}
                            ${i === mainData.length - 3 && j === 0 ? "rounded-bl-xl" : ""}
                            ${i === mainData.length - 3 && j === 11 ? "rounded-br-xl" : ""}`}
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
            <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${headerStyle}`}>Masters Leaderboard</h2>
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
            <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${headerStyle}`}>Summary</h2>
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
