import { getDocumentData, updateDocumentData } from "@/db/client/documents";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DocumentEditorProps {
  file: string;
}

export default function DocumentEditor({ file }: DocumentEditorProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<JSON | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    const fetchDocumentData = async () => {
      if (!file) {
        if (mounted) {
          return;
        }
      }
      setLoading(true);
      setError(null);

      try {
        const { error, data } = await getDocumentData(file);
        console.log(data);
        if (!mounted) return;
        if (error) {
          setError(error.message ?? "Failed to fetch document data");
          setLoading(false);
          return;
        }
        if (data) {
          setDetails(data[0].data);
          setName(data[0].file_name);
          setStatus(data[0].status);
          setLoading(false);
        } else {
          setError("No document data found for file");
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Unknown error fetching document data:", err);
      }
    };

    fetchDocumentData();
    return () => {
      mounted = false;
    };
  }, [file]);

  const handleUpdateChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    console.log("Saving changes...");
    const form = e.currentTarget;
    const entries = Object.entries(details || {});
    const result: Record<string, string> = {};

    entries.forEach(([key], index) => {
      const input = form.querySelector<HTMLInputElement>(`#input-${index}`);
      if (input) {
        result[key] = input.value;
      }
    });

    const { error } = await updateDocumentData(file, result as unknown as JSON);
    setButtonLoading(false);
    if (error) {
      console.error("Error updating document data:", error);
      return;
    }
    toast.success("Changes saved.");
    window.location.reload();
  };

  if (!file) {
    return (
      <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3 flex items-center flex-col justify-center"></div>
    );
  }

  if (loading) {
    return (
      <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3 flex items-center flex-col justify-center">
        <p className="text-gray-400">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3 flex items-center flex-col justify-center">
        <p className="text-[oklch(0.7_0.15_0)]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-4 flex flex-col">
      <h1 className="font-semibold text-xl self-start">{name}</h1>
      <div className="flex h-full items-center">
        <form
          onSubmit={handleUpdateChanges}
          className="w-full max-w-lg flex flex-col flex-1 overflow-y-scroll max-h-[95%] px-5"
        >
          {Object.entries(details || {})
            .map(([key, value], index) => (
              <div key={key} className="flex flex-col">
                <label
                  htmlFor={`input-${index}`}
                  className="text-[oklch(0.6_0_0)] font-semibold"
                >
                  {key == "dob" ? "dob (YYYY-MM-DD): " : key + ":"}
                </label>
                <input
                  id={`input-${index}`}
                  className={`${
                    status === "verified"
                      ? "bg-[oklch(0.6_0_0)]"
                      : "bg-[oklch(0.8_0_0)]"
                  } text-[oklch(0.1_0_0)]  py-1 px-3 shadow-inner shadow-black rounded-full focus:outline-none focus:ring-2 focus:ring-[oklch(0.9_0_0)] focus:bg-[oklch(0.9_0_0)]`}
                  type="text"
                  disabled={status === "verified"}
                  defaultValue={String(value ?? "")}
                />
              </div>
            ))}
          <button
          aria-label="save changes"
            type="submit"
            className={`mt-4 shadow-(--shadow-s) text-white rounded-md px-4 py-2 ${
              buttonLoading || status === "verified"
                ? "bg-[oklch(0.7_0.1_270)] cursor-not-allowed"
                : "bg-[oklch(0.7_0.3_270)] hover:bg-[oklch(0.7_0.35_270)] "
            }`}
            disabled={buttonLoading || status === "verified"}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
