// Text2Ae(AE).jsx
// Pro Import: Applies Fill/Stroke accurately + Absolute Positioning
// Language: English

(function (thisObj) {

    // ==============================================
    // 1. CORE LOGIC (Separated Function)
    // ==============================================
    function runImport() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select or open a Composition first.");
            return;
        }

        var jsonPath = "";

        // 1. Strict Requirement: Selected Layer (for Path Detection only)
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
                    alert("JSON data file not found!\nExpected at: " + potentialPath + "\n\nPlease run the export script in Illustrator first.");
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

        // Safe JSON parsing
        var textData;
        try {
            textData = eval(jsonContent);
        } catch (e) {
            alert("Error parsing JSON data.");
            return;
        }

        app.beginUndoGroup("Pro Text Import");

        for (var i = 0; i < textData.length; i++) {
            var item = textData[i];

            var textLayer = comp.layers.addText(item.content);
            textLayer.name = item.content.substring(0, 20);

            // NO PARENTING.
            // We trust that the User's Comp Size matches the AI Artboard Size.
            // We place text at absolute coordinates relative to Comp Top-Left.

            var textProp = textLayer.property("Source Text");
            var textDocument = textProp.value;

            // Basic
            textDocument.fontSize = item.size;
            textDocument.justification = ParagraphJustification.LEFT_JUSTIFY;

            // Leading (Line Spacing)
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

            // 1. Set Anchor Point to Geometry Top-Left
            var rect = textLayer.sourceRectAtTime(0, false);
            textLayer.anchorPoint.setValue([rect.left + rect.width / 2, rect.top + rect.height / 2]);

            // 2. Set Absolute Position
            textLayer.position.setValue([item.posX, item.posY]);

            // --- V2 NEW PROPERTIES ---

            // 3. Opacity
            if (item.opacity !== undefined) {
                textLayer.opacity.setValue(item.opacity);
            }

            // 4. Scale
            // AI sends Horizontal/Vertical Scale as %, e.g., 150. AE expects [150, 100].
            if (item.scaleX !== undefined && item.scaleY !== undefined) {
                textLayer.scale.setValue([item.scaleX, item.scaleY]);
            }

            // 5. Rotation
            // AI Rotation is often counter-clockwise? Let's test.
            // Matrix atan2 returns angle in radians -> degrees.
            // Usually AI Rotation = -AE Rotation (+ is CW in AE, CCW in Math?).
            // For now, applying directly. If flipped, we multiply by -1.
            if (item.rotation !== undefined) {
                // IMPORTANT: The anchor point was set to Top-Left. 
                // Rotation will happen around Top-Left. 
                // In AI, objects often rotate around Center. 
                // This might cause a visual shift if the rotation origin doesn't match.
                // For V2, we accept Top-Left rotation as the standard behavior for text blocks.
                textLayer.rotation.setValue(-item.rotation); // Negating to match AE direction
            }
        }

        app.endUndoGroup();
    } // End of runImport


    // ==============================================
    // 2. UI INTERFACE (Palette / Dockable)
    // ==============================================
    var palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Text2Ae", undefined, { resizeable: true });

    if (palette instanceof Window) {
        palette.text = "Text2Ae";
        palette.orientation = "column";
        palette.alignChildren = ["center", "top"];
        palette.spacing = 10;
        palette.margins = 16;
    } else {
        palette.orientation = "column";
        palette.alignChildren = ["center", "top"];
        palette.spacing = 10;
        palette.margins = 16;
    }

    var button1 = palette.add("button", undefined, undefined, { name: "button1" });
    button1.text = "import";

    button1.onClick = function () {
        runImport();
    };

    if (palette instanceof Window) {
        palette.show();
    } else {
        palette.layout.layout(true);
    }

})(this);