// Text2Ae - Universal Script
// Works in both Adobe Illustrator (Export) and After Effects (Import)
// Language: English & Arabic Support

(function (thisObj) {

    // ========================================================================
    // CONFIGURATION MANAGEMENT
    // ========================================================================
    var CONFIG_FILE_PATH = Folder.userData.fsName + "/Text2Ae_Config.json";

    var defaultConfig = {
        showAlertInIllustrator: true,
        showAlertInAfterEffects: true
    };

    function loadConfig() {
        var configFile = new File(CONFIG_FILE_PATH);
        if (configFile.exists) {
            try {
                configFile.open("r");
                configFile.encoding = "UTF-8";
                var jsonContent = configFile.read();
                configFile.close();
                return eval("(" + jsonContent + ")");
            } catch (e) {
                return defaultConfig;
            }
        }
        return defaultConfig;
    }

    function saveConfig(config) {
        try {
            var jsonString = "{\n";
            jsonString += '  "showAlertInIllustrator": ' + config.showAlertInIllustrator + ',\n';
            jsonString += '  "showAlertInAfterEffects": ' + config.showAlertInAfterEffects + '\n';
            jsonString += "}";

            var configFile = new File(CONFIG_FILE_PATH);
            configFile.open("w");
            configFile.encoding = "UTF-8";
            configFile.write(jsonString);
            configFile.close();
            return true;
        } catch (e) {
            return false;
        }
    }

    var config = loadConfig();

    // ========================================================================
    // APPLICATION DETECTION
    // ========================================================================

    // Detect which Adobe application is running (Safe Detection)
    var appName = "";
    try {
        if (typeof app !== "undefined" && app.name) {
            appName = app.name;
        } else if (typeof BridgeTalk !== "undefined" && BridgeTalk.appName) {
            appName = BridgeTalk.appName;
        }
    } catch (e) {
        appName = "";
    }

    // Convert to lowercase for easier matching
    var appNameLower = appName.toLowerCase();

    if (appNameLower.indexOf("illustrator") !== -1) {
        // ====================================
        // ILLUSTRATOR MODE - EXPORT
        // ====================================
        runIllustratorExport();

    } else if (appNameLower.indexOf("after") !== -1 || appNameLower.indexOf("effects") !== -1) {
        // ====================================
        // AFTER EFFECTS MODE - IMPORT
        // ====================================
        runAfterEffectsImport(thisObj);

    } else {
        alert("Detection Failed\n\nApp Name: '" + appName + "'\n\nThis script works only in Adobe Illustrator or After Effects.");
    }

    // ========================================================================
    // ILLUSTRATOR EXPORT FUNCTION
    // ========================================================================
    function runIllustratorExport() {
        var doc = app.activeDocument;

        // Check if the document has been saved
        try {
            var docPath = doc.fullName;
        } catch (e) {
            alert("Please save the Illustrator document first before exporting.");
            return;
        }

        // Get Active Artboard Bounds
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

        // Helper: Decompose Matrix to get Rotation
        function getRotation(matrix) {
            var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
            var deg = rad * (180 / Math.PI);
            return deg;
        }

        // Iterate through ALL text frames
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

                // Scaling
                var scaleX = attrs.horizontalScale;
                var scaleY = attrs.verticalScale;

                // Rotation
                var rot = 0;
                if (tf.matrix) {
                    rot = getRotation(tf.matrix);
                }

                // Position
                var geo = tf.geometricBounds;
                var geoLeft = geo[0];
                var geoTop = geo[1];
                var geoRight = geo[2];
                var geoBottom = geo[3];

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

                // Leading
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
                // Skip problematic text frames
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

        if (config.showAlertInIllustrator) {
            alert("Export Complete!\n\n" +
                "Exported: " + data.length + " text items\n" +
                "Saved to: " + jsonPath + "\n\n" +
                "Now open After Effects and run this script again to import.");
        }
    }

    // ========================================================================
    // AFTER EFFECTS IMPORT FUNCTION
    // ========================================================================
    function runAfterEffectsImport(thisObj) {

        function doImport() {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                alert("Please select or open a Composition first.");
                return;
            }

            var jsonPath = "";

            // Check if layer is selected for path detection
            if (comp.selectedLayers.length === 0) {
                alert("Please select the layer that corresponds to your Illustrator file (for path detection).");
                return;
            }

            var refLayer = comp.selectedLayers[0];

            // Try to find JSON from Source File
            if (refLayer.source && refLayer.source.file) {
                var sourcePath = refLayer.source.file.fsName;
                var dotIndex = sourcePath.lastIndexOf(".");
                if (dotIndex !== -1) {
                    var potentialPath = sourcePath.substring(0, dotIndex) + ".json";
                    if (new File(potentialPath).exists) {
                        jsonPath = potentialPath;
                    } else {
                        alert("JSON data file not found!\n\n" +
                            "Expected at: " + potentialPath + "\n\n" +
                            "Please run the export script in Illustrator first.");
                        return;
                    }
                }
            } else {
                alert("The selected layer does not have a valid source file path.");
                return;
            }

            if (jsonPath === "") return;

            var file = new File(jsonPath);
            file.open("r");
            file.encoding = "UTF-8";
            var jsonContent = file.read();
            file.close();

            // Parse JSON
            var textData;
            try {
                textData = eval(jsonContent);
            } catch (e) {
                alert("Error parsing JSON data.\n\n" + e.toString());
                return;
            }

            app.beginUndoGroup("Text2Ae Import");

            var imported = 0;
            for (var i = 0; i < textData.length; i++) {
                try {
                    var item = textData[i];

                    var textLayer = comp.layers.addText(item.content);
                    textLayer.name = item.content.substring(0, 20);

                    var textProp = textLayer.property("Source Text");
                    var textDocument = textProp.value;

                    // Basic
                    textDocument.fontSize = item.size;
                    textDocument.justification = ParagraphJustification.LEFT_JUSTIFY;

                    // Leading
                    if (item.leading !== undefined && item.leading > 0) {
                        textDocument.leading = item.leading;
                    }

                    try { textDocument.font = item.font; } catch (e) { }

                    // Fill
                    if (item.hasFill) {
                        textDocument.applyFill = true;
                        textDocument.fillColor = item.fillColor;
                    } else {
                        textDocument.applyFill = false;
                    }

                    // Stroke
                    if (item.hasStroke) {
                        textDocument.applyStroke = true;
                        textDocument.strokeColor = item.strokeColor;
                        textDocument.strokeWidth = item.strokeWidth;
                        textDocument.strokeOverFill = true;
                    } else {
                        textDocument.applyStroke = false;
                    }

                    textProp.setValue(textDocument);

                    // Anchor Point (Center)
                    var rect = textLayer.sourceRectAtTime(0, false);
                    textLayer.anchorPoint.setValue([rect.left + rect.width / 2, rect.top + rect.height / 2]);

                    // Position
                    textLayer.position.setValue([item.posX, item.posY]);

                    // Opacity
                    if (item.opacity !== undefined) {
                        textLayer.opacity.setValue(item.opacity);
                    }

                    // Scale
                    if (item.scaleX !== undefined && item.scaleY !== undefined) {
                        textLayer.scale.setValue([item.scaleX, item.scaleY]);
                    }

                    // Rotation
                    if (item.rotation !== undefined) {
                        textLayer.rotation.setValue(-item.rotation);
                    }

                    imported++;
                } catch (e) {
                    // Skip problematic items
                }
            }

            app.endUndoGroup();

            if (config.showAlertInAfterEffects) {
                alert("Import Complete!\n\n" +
                    "Imported: " + imported + " / " + textData.length + " text layers\n\n" +
                    "Your text is now in After Effects!");
            }
        }

        // Create UI Panel
        var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Text2Ae", undefined, { resizeable: false });

        if (palette instanceof Window) {
            palette.text = "Text2Ae";
            palette.orientation = "column";
            palette.alignChildren = ["fill", "top"];
            palette.spacing = 10;
            palette.margins = 16;
        } else {
            palette.orientation = "column";
            palette.alignChildren = ["fill", "top"];
            palette.spacing = 10;
            palette.margins = 16;
        }

        // Button Group (Import + Settings)
        var buttonGroup = palette.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignChildren = ["fill", "center"];
        buttonGroup.spacing = 5;

        var button1 = buttonGroup.add("button", undefined, "Import from AI", { name: "button1" });
        button1.preferredSize = [150, 25];

        var settingsBtn = buttonGroup.add("button", undefined, "\u2699", { name: "settingsBtn" });
        settingsBtn.preferredSize = [30, 25];

        // Settings Dialog Function
        function showSettings() {
            var settingsDialog = new Window("dialog", "Text2Ae Settings");
            settingsDialog.orientation = "column";
            settingsDialog.alignChildren = ["fill", "top"];
            settingsDialog.spacing = 10;
            settingsDialog.margins = 16;

            var checkbox1 = settingsDialog.add("checkbox", undefined, "Show alerts in Illustrator");
            checkbox1.value = config.showAlertInIllustrator;

            var checkbox2 = settingsDialog.add("checkbox", undefined, "Show alerts in After Effects");
            checkbox2.value = config.showAlertInAfterEffects;

            var btnGroup = settingsDialog.add("group");
            btnGroup.orientation = "row";
            btnGroup.alignChildren = ["center", "center"];

            var okBtn = btnGroup.add("button", undefined, "OK");
            var cancelBtn = btnGroup.add("button", undefined, "Cancel");

            okBtn.onClick = function () {
                config.showAlertInIllustrator = checkbox1.value;
                config.showAlertInAfterEffects = checkbox2.value;
                saveConfig(config);
                settingsDialog.close();
            };

            cancelBtn.onClick = function () {
                settingsDialog.close();
            };

            settingsDialog.show();
        }

        button1.onClick = function () {
            doImport();
        };

        settingsBtn.onClick = function () {
            showSettings();
        };

        if (palette instanceof Window) {
            palette.show();
        } else {
            palette.layout.layout(true);
        }
    }

})(this);
