import { useState } from "react";

export type ExportFormat = "csv" | "json" | "xml" | "xlsx";

export interface ExportOptions {
  format: ExportFormat;
  includeAddresses: boolean;
  includeCustomFields: boolean;
  includeCreditCards: boolean;
  exportAll: boolean;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: ExportOptions) => void;
  hasPagination: boolean;
  currentPage: number;
  totalPages: number;
}

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  hasPagination,
  currentPage,
  totalPages,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [includeAddresses, setIncludeAddresses] = useState(false);
  const [includeCustomFields, setIncludeCustomFields] = useState(false);
  const [includeCreditCards, setIncludeCreditCards] = useState(false);
  const [exportAll, setExportAll] = useState(true);

  const handleExport = () => {
    onExport({
      format,
      includeAddresses,
      includeCustomFields,
      includeCreditCards,
      exportAll,
    });
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Export Customers
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose your export format and options.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Format</h4>
              <div className="space-y-2">
                {(["csv", "json", "xml", "xlsx"] as ExportFormat[]).map(
                  (formatOption) => (
                    <label
                      key={formatOption}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name="format"
                        value={formatOption}
                        checked={format === formatOption}
                        onChange={(e) =>
                          setFormat(e.target.value as ExportFormat)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        {formatOption.toUpperCase()}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                Include Additional Data
              </h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeAddresses}
                    onChange={(e) => setIncludeAddresses(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Addresses</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeCustomFields}
                    onChange={(e) => setIncludeCustomFields(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Custom Fields</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeCreditCards}
                    onChange={(e) => setIncludeCreditCards(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Credit Cards</span>
                </label>
              </div>
            </div>

            {hasPagination && totalPages > 1 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Export Scope</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="scope"
                      value="all"
                      checked={exportAll}
                      onChange={() => setExportAll(true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">All Pages</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="scope"
                      value="current"
                      checked={!exportAll}
                      onChange={() => setExportAll(false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      Current Page Only (Page {currentPage})
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
