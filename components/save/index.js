import { useState } from "react";
import { saveAs } from 'file-saver';
import FontGenerator from 'svg-to-iconfont';

const IconFontGenerator = ({ svgList }) => {
    const [fontName, setFontName] = useState('MyIconFont');
    const [fontSize, setFontSize] = useState(16);
    const [fontHeight, setFontHeight] = useState(1000);

    const generateIconFont = () => {
        const fontGenerator = new FontGenerator({
            fontName,
            fontSize,
            fontHeight,
            descent: 200,
            normalize: true,
        });

        svgList.forEach((svg, index) => {
            fontGenerator.addGlyph(`icon-${index + 1}`, svg);
        });

        fontGenerator.generate().then((result) => {
            const blob = new Blob([result.ttf], { type: 'application/x-font-ttf' });
            saveAs(blob, `${fontName}.ttf`);
        });
    };

    return (
        <div>
            <h2>Icon Font Generator</h2>
            <div>
                <label htmlFor="font-name-input">Font Name:</label>
                <input
                    id="font-name-input"
                    type="text"
                    value={fontName}
                    onChange={(e) => setFontName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="font-size-input">Font Size:</label>
                <input
                    id="font-size-input"
                    type="number"
                    min="1"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="font-height-input">Font Height:</label>
                <input
                    id="font-height-input"
                    type="number"
                    min="1"
                    max="10000"
                    value={fontHeight}
                    onChange={(e) => setFontHeight(parseInt(e.target.value))}
                />
            </div>
            <button onClick={generateIconFont}>Generate Icon Font</button>
        </div>
    );
};

export default IconFontGenerator;
