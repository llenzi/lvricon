import { useState } from "react";
import downloadIconFont from "./convert";

export default function IconFontPage({ icons }) {
    const [downloading, setDownloading] = useState(false);

    function handleDownload() {
        setDownloading(true);
        downloadIconFont(icons);
        setDownloading(false);
    }

    return (
        <div>
            <button onClick={handleDownload} disabled={downloading}>
                {downloading ? "Downloading..." : "Download Icon Font"}
            </button>
        </div>
    );
}