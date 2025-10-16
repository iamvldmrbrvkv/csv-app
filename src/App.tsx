import { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { useVirtualizer } from "@tanstack/react-virtual";

interface CSVData {
  headers: string[];
  rows: string[][];
}

function App() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  /**
   * Handles CSV file upload and parsing
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length > 0) {
          const headers = data[0];
          const rows = data
            .slice(1)
            .filter((row) => row.some((cell) => cell.trim() !== ""));

          setCsvData({ headers, rows });
          setIsLoading(false);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setIsLoading(false);
        alert("Ошибка при загрузке CSV файла");
      },
    });
  };

  const filteredRows =
    !csvData || !searchQuery.trim()
      ? csvData?.rows || []
      : csvData.rows.filter((row) =>
          row.some((cell) =>
            cell.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );

  const rowVirtualizer = useVirtualizer({
    count: filteredRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (parentRef.current && csvData) {
      rowVirtualizer.measure();
    }
  }, [csvData, rowVirtualizer]);

  /**
   * Returns appropriate column width based on header name
   */
  const getColumnWidth = (header: string): string => {
    const headerLower = header.toLowerCase();
    if (headerLower === "id") return "100px";
    if (headerLower === "имя" || headerLower === "name") return "180px";
    if (headerLower === "email") return "280px";
    if (headerLower === "возраст" || headerLower === "age") return "100px";
    if (headerLower === "город" || headerLower === "city") return "180px";
    if (headerLower === "должность" || headerLower === "occupation")
      return "200px";
    if (headerLower === "зарплата" || headerLower === "salary") return "120px";
    if (headerLower === "отдел" || headerLower === "department") return "150px";
    if (headerLower === "дата_приема" || headerLower === "join_date")
      return "150px";
    return "200px"; // default width
  };

  const handleReset = () => {
    setCsvData(null);
    setSearchQuery("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CSV Viewer</h1>
          <p className="text-sm text-gray-600 mt-1">
            Загрузите и просмотрите большие CSV файлы (до 1M+ строк)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Section */}
        {!csvData && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="max-w-xl mx-auto text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Загрузить CSV файл
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Выберите файл для загрузки и просмотра
              </p>
              <div className="mt-6">
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Выбрать файл
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              {isLoading && (
                <div className="mt-4 text-sm text-gray-600">
                  Загрузка и обработка файла...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data View Section */}
        {csvData && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск по всем колонкам..."
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{fileName}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {filteredRows.length.toLocaleString()} /{" "}
                      {csvData.rows.length.toLocaleString()} строк
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Headers */}
              <div
                ref={headerRef}
                className="border-b bg-gray-50"
                style={{
                  overflowX: "scroll",
                  overflowY: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <style>{`
                  div[style*="scrollbarWidth"]::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="inline-block min-w-full align-middle">
                  <div
                    className="flex"
                    style={{ width: "max-content", minWidth: "100%" }}
                  >
                    <div
                      className="flex-shrink-0 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r bg-gray-50"
                      style={{ width: "80px" }}
                    >
                      #
                    </div>
                    {csvData.headers.map((header, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0"
                        style={{ width: getColumnWidth(header) }}
                      >
                        {header || `Column ${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rows - Using Virtualization for performance */}
              <div
                ref={parentRef}
                className="overflow-auto"
                style={{ height: "600px" }}
                onScroll={(e) => {
                  if (headerRef.current) {
                    headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
                  }
                }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "max-content",
                    minWidth: "100%",
                    position: "relative",
                  }}
                >
                  {virtualItems.map((virtualRow) => {
                    const row = filteredRows[virtualRow.index];
                    return (
                      <div
                        key={virtualRow.key}
                        className="flex hover:bg-gray-50 border-b absolute top-0 left-0 w-full"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div
                          className="flex-shrink-0 px-4 py-3 text-sm text-gray-500 border-r bg-white"
                          style={{ width: "80px" }}
                        >
                          {virtualRow.index + 1}
                        </div>
                        {row.map((cell, cellIndex) => (
                          <div
                            key={cellIndex}
                            className="flex-shrink-0 px-4 py-3 text-sm text-gray-900 border-r last:border-r-0 truncate"
                            style={{
                              width: getColumnWidth(csvData.headers[cellIndex]),
                            }}
                            title={cell}
                          >
                            {cell}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {filteredRows.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500">
                Ничего не найдено по запросу "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
