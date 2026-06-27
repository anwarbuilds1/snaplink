import { useUrlQrCode } from "../../hooks/useUrls";
import { AlertTriangle } from "lucide-react";

type QrCodeModalContentProps = {
  urlId: string;
};

export const QrCodeModalContent = ({ urlId }: QrCodeModalContentProps) => {
  const { data: qrUrl, isLoading, isError } = useUrlQrCode(urlId, !!urlId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-600"></div>
        <p className="text-xs text-slate-500 font-medium">Generating QR Code...</p>
      </div>
    );
  }

  if (isError || !qrUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-red-500 gap-2">
        <AlertTriangle size={24} />
        <p className="text-sm font-semibold">Failed to load QR Code</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4">
      <img
        src={qrUrl}
        alt="Short URL QR Code"
        className="w-48 h-48 border border-slate-200 dark:border-slate-800 rounded-lg bg-white p-2"
      />
      <a
        href={qrUrl}
        download={`qr-code-${urlId}.png`}
        className="w-full text-center py-2 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
      >
        Download PNG
      </a>
    </div>
  );
};
