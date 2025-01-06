import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Loader2 } from "lucide-react";

const App = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [client, setClient] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        if (!client || !fromDate || !toDate) {
            alert("Please fill in all fields before fetching data.");
            return;
        }

        setIsLoading(true);
        const formattedFromDate = fromDate.replace("T", " ") + ":00";
        const formattedToDate = toDate.replace("T", " ") + ":00";

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASEURL}/api/data`, {
                fromDate: formattedFromDate,
                toDate: formattedToDate,
                client,
            });

            if (response.data && response.data.data) {
                setData(response.data.data);
            } else {
                console.log("No data found for the given query.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sensor Data");
        XLSX.writeFile(wb, "sensor_data.xlsx");
    };

    return (
        <div className="font-sans p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Fetch Sensor Data</h1>

            {/* Input Form Section */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
                <div className="flex-1">
                    <label className="block text-lg mb-2">Client:</label>
                    <input
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-lg mb-2">From Date:</label>
                    <input
                        type="datetime-local"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-lg mb-2">To Date:</label>
                    <input
                        type="datetime-local"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                    onClick={fetchData}
                    disabled={isLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg text-lg transition-colors duration-200 disabled:bg-green-300 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            Loading...
                        </>
                    ) : (
                        'Fetch Data'
                    )}
                </button>
                <button
                    onClick={downloadExcel}
                    disabled={data.length === 0}
                    className={`flex-1 py-4 px-6 rounded-lg text-lg text-white transition-colors duration-200 
                        ${data.length === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 cursor-pointer'}`}
                >
                    Download Excel
                </button>
            </div>

            {/* Results Section */}
            <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Results</h2>

                {data.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm md:text-base border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 md:p-4 text-left font-semibold">ID</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">Device Type</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">Node</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">D1</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">D2</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">Date Time</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">Reading Time</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">Client</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">Location</th>
                                    <th className="p-3 md:p-4 text-left font-semibold">MAC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 md:p-4">{item.id}</td>
                                        <td className="p-3 md:p-4">{item.Dev_type}</td>
                                        <td className="p-3 md:p-4">{item.node}</td>
                                        <td className="p-3 md:p-4">{item.d1}</td>
                                        <td className="p-3 md:p-4">{item.d2}</td>
                                        <td className="p-3 md:p-4">{item.dtime}</td>
                                        <td className="p-3 md:p-4">{item.reading_time}</td>
                                        <td className="p-3 md:p-4">{item.client}</td>
                                        <td className="p-3 md:p-4">{item.loc}</td>
                                        <td className="p-3 md:p-4">{item.mac}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;