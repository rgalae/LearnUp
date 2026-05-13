import { useEffect, useState } from "react";
import axios from "axios";

function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/users/student-results/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total = results.length;

  const passed = results.filter((r) => r.note >= 10).length;

  const average =
    total > 0
      ? (results.reduce((acc, r) => acc + r.note, 0) / total).toFixed(1)
      : 0;

  if (loading) {
    return <p>Loading...</p>;
  }

  const downloadCertificate = async (coursId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/cours/certificat/${coursId}/pdf/`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", `certificate_${coursId}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      console.error(error);

      alert("Failed to download certificate");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Results</h1>

        <p className="text-gray-400 mt-2">Your real quiz results</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
          <p className="text-gray-400">TOTAL RESULTS</p>

          <h2 className="text-5xl font-bold mt-4">{total}</h2>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
          <p className="text-gray-400">PASSED</p>

          <h2 className="text-5xl font-bold mt-4 text-green-400">{passed}</h2>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
          <p className="text-gray-400">AVERAGE</p>

          <h2 className="text-5xl font-bold mt-4">{average}%</h2>
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-white">All Results</h2>
        </div>

        <div>
          {results.length === 0 ? (
            <p className="p-6 text-gray-400">No results yet</p>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-6 border-b border-gray-800"
              >
                <div>
                  <h3 className="text-xl font-semibold">{result.cours}</h3>

                  <p className="text-gray-400">Grade: {result.grade}</p>
                </div>

                <div className="text-right space-y-3">
                  <div>
                    <p className="text-2xl font-bold">{result.note}%</p>

                    <p className="text-gray-400">GPA: {result.gpa}</p>
                  </div>

                  {result.note >= 10 && (
                    <button
                      onClick={() => downloadCertificate(result.cours_id)}
                      className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl text-sm"
                    >
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
