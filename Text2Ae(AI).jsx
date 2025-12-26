// Text2Ae(AI).jsx
// Advanced Export: Text + Positions + Colors + Strokes + Weights
// Language: English
// Stable Version - NO paragraphAttributes access

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
        var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
        var deg = rad * (180 / Math.PI);
        return deg;
    }

    // Iterate through ALL text frames (No filtering)
    for (var i = 0; i < textFrames.length; i++) {
        try {
            var tf = textFrames[i];
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

            // Opacity
            var op = tf.opacity;

            // Scaling (Character Stretch)
            var scaleX = attrs.horizontalScale;
            var scaleY = attrs.verticalScale;

            // Rotation (Matrix)
            var rot = 0;
            if (tf.matrix) {
                rot = getRotation(tf.matrix);
            }

            // Position - use geometricBounds for accuracy
            var geo = tf.geometricBounds;
            var geoLeft = geo[0];
            var geoTop = geo[1];
            var geoRight = geo[2];
            var geoBottom = geo[3];

            // Calculate CENTER position for robust rotation support
            var centerX = (geoLeft + geoRight) / 2;
            var centerY = (geoTop + geoBottom) / 2;

            var distanceX = centerX - abLeft;
            var distanceY = abTop - centerY;

            // Content
            var contentStr = "";
            try {
                contentStr = new String(tf.contents).toString();
                contentStr = contentStr.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
            } catch (e) {
                contentStr = "";
            }

            // Leading (Line Spacing) - Direct from characterAttributes (SAFE)
            var leading = 0;
            try {
                if (attrs.leading !== undefined && attrs.leading !== null) {
                    leading = Number(attrs.leading);
                }
            } catch (e) {
                leading = 0;
            }

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
                opacity: op,
                scaleX: scaleX,
                scaleY: scaleY,
                rotation: rot,
                leading: leading
            };

            data.push(textData);
        } catch (e) {
            // Skip this text frame if it causes errors
        }
    }

    // Save JSON
    var jsonString = "[\n";
    for (var j = 0; j < data.length; j++) {
        var item = data[j];
        jsonString += '  {\n';
        var safeContent = item.content.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n");
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
        jsonString += '    "opacity": ' + item.opacity + ',\n';
        jsonString += '    "scaleX": ' + item.scaleX + ',\n';
        jsonString += '    "scaleY": ' + item.scaleY + ',\n';
        jsonString += '    "rotation": ' + item.rotation + ',\n';
        jsonString += '    "leading": ' + item.leading + '\n';

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

    alert("Exported " + data.length + " text items successfully!");
})();