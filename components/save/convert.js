import webfontsGenerator from "webfonts-generator";
import { saveAs } from "file-saver";

function downloadIconFont(icons) {
    // Convert the SVG icons to a webfont file
    webfontsGenerator(
        {
            files: icons,
            dest: "fonts/",
            fontName: "my-icons",
            css: true,
        },
        function (error, result) {
            if (error) {
                console.error("Error generating icon font:", error);
                return;
            }
            // Save the webfont file to the user's computer
            const fontUrl = URL.createObjectURL(result["ttf"]);
            saveAs(fontUrl, "my-icons.ttf");
        }
    );
}

export default downloadIconFont