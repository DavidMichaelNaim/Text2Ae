// Text2Ae(AI).jsx
// Advanced Export: Text + Positions + Colors + Strokes + Weights
// Language: English

(function () {
    var doc = app.activeDocument;

    // Check if the document has been saved
    try {
        var docPath = doc.fullName;
    } catch (e) {
        alert("Please save the Illustrator document first before exporting.");
        return;
    }

    // Get Active Artboard Bounds (for relative positioning)
    var index = doc.artboards.getActiveArtboardIndex();
    var artboard = doc.artboards[index];
    var abRect = artboard.artboardRect;
    var abLeft = abRect[0];
    var abTop = abRect[1];

    var textFrames = doc.textFrames;
    var data = [];

    // Helper: Extract Color
    function getColorData(aiColor) {
        if (aiColor.typename === "NoColor") return null;
        if (aiColor.typename === "RGBColor") return [aiColor.red / 255, aiColor.green / 255, aiColor.blue / 255];
        if (aiColor.typename === "GrayColor") return [1 - (aiColor.gray / 100), 1 - (aiColor.gray / 100), 1 - (aiColor.gray / 100)];
        return [0, 0, 0];
    }

    // Helper: Decompose Matrix to get Rotation (in Degrees)
    function getRotation(matrix) {
        // Matrix: [a, b, c, d, tx, ty]
        // Rotation = atan2(b, a)
        // Convert Radians to Degrees
        var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
        var deg = rad * (180 / Math.PI);
        return deg;
    }

    // Helper: Check for Drop Shadow (Basic Detection)
    // Adobe scripts can't easily read specific effect parameters.
    // We check if the item has any effect, or rely on visual bounds difference?
    // For now, we set a placeholder.
    function hasShadow(item) {
        // This is very limited in JS. 
        // We will default to false unless we find a specific graphic style?
        // For V2, we will skip complex effect detection to avoid errors.
        return false;
    }

    // Iterate through ALL text frames (No filtering)
    for (var i = 0; i < textFrames.length; i++) {
        var tf = textFrames[i];

        // User requested to include EVERYTHING (even hidden or outside artboard)
        // so we skipping specific checks.

        var attrs = tf.textRange.characterAttributes;

        // Fill
        var hasFill = false;
        var fillColor = [1, 1, 1];
        var fColorData = getColorData(attrs.fillColor);
        if (fColorData !== null) {
            hasFill = true;
            fillColor = fColorData;
        }

        // Stroke
        var hasStroke = false;
        var strokeColor = [1, 0, 0];
        var strokeWidth = 0;
        var sColorData = getColorData(attrs.strokeColor);
        if (sColorData !== null && attrs.strokeWeight > 0) {
            hasStroke = true;
            strokeColor = sColorData;
            strokeWidth = attrs.strokeWeight;
        }

        // --- V2 NEW PROPERTIES ---

        // 1. Opacity
        var op = tf.opacity; // 0-100

        // 2. Scaling (Character Stretch)
        var scaleX = attrs.horizontalScale; // Default 100
        var scaleY = attrs.verticalScale;   // Default 100

        // 3. Rotation (Matrix)
        var rot = 0;
        if (tf.matrix) {
            rot = getRotation(tf.matrix);
        }

        // Position
        // usage of geometricBounds for accuracy
        var geo = tf.geometricBounds;
        var geoLeft = geo[0];
        var geoTop = geo[1];

        // Calculated relative to Active Artboard Top-Left
        var distanceX = geoLeft - abLeft;
        var distanceY = abTop - geoTop;

        var contentStr = tf.contents.toString().replace(/[\r\n]+/g, "\r");

        var textData = {
            content: contentStr,
            font: attrs.textFont.name,
            size: attrs.size,
            posX: distanceX,
            posY: distanceY,
            hasFill: hasFill,
            fillColor: fillColor,
            hasStroke: hasStroke,
            strokeColor: strokeColor,
            strokeWidth: strokeWidth,
            // V2 Data
            opacity: op,
            scaleX: scaleX,
            scaleY: scaleY,
            rotation: rot,
            hasShadow: false // Placeholder
        };

        data.push(textData);
    }

    // Save JSON
    var jsonString = "[\n";
    for (var j = 0; j < data.length; j++) {
        var item = data[j];
        jsonString += '  {\n';
        var safeContent = item.content.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        jsonString += '    "content": "' + safeContent + '",\n';
        jsonString += '    "font": "' + item.font + '",\n';
        jsonString += '    "size": ' + item.size + ',\n';
        jsonString += '    "posX": ' + item.posX + ',\n';
        jsonString += '    "posY": ' + item.posY + ',\n';
        jsonString += '    "hasFill": ' + item.hasFill + ',\n';
        jsonString += '    "fillColor": [' + item.fillColor.join(",") + '],\n';
        jsonString += '    "hasStroke": ' + item.hasStroke + ',\n';
        jsonString += '    "strokeColor": [' + item.strokeColor.join(",") + '],\n';
        jsonString += '    "strokeWidth": ' + item.strokeWidth + ',\n';

        // V2 Fields
        jsonString += '    "opacity": ' + item.opacity + ',\n';
        jsonString += '    "scaleX": ' + item.scaleX + ',\n';
        jsonString += '    "scaleY": ' + item.scaleY + ',\n';
        jsonString += '    "rotation": ' + item.rotation + '\n';

        jsonString += '  }';
        if (j < data.length - 1) jsonString += ",";
        jsonString += "\n";
    }
    jsonString += "]";

    var docName = doc.name;
    var lastDot = docName.lastIndexOf(".");
    var baseName = (lastDot != -1) ? docName.substring(0, lastDot) : docName;

    var jsonPath = doc.path.fsName + "/" + baseName + ".json";
    if ($.os.indexOf("Windows") !== -1) jsonPath = jsonPath.replace(/\//g, "\\");

    var file = new File(jsonPath);
    file.open("w");
    file.encoding = "UTF-8";
    file.write(jsonString);
    file.close();

    var bridgeFile = new File(Folder.temp.fsName + "/text2ae_bridge.txt");
    bridgeFile.open("w");
    bridgeFile.write(jsonPath);
    bridgeFile.close();

    alert("Exported " + data.length + " text items (All).");
})();