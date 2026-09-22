---
title: "GuiConfig"
description: "public class GuiConfig extends GuiScreen"
package: "net/minecraftforge/fml/client/config"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/config/GuiConfig.html"
sourceType: javadoc
---

# GuiConfig

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.config.GuiConfig

## Class signature

```java
public class GuiConfig extends GuiScreen
```

## Constructors

- `GuiConfig(GuiScreen parentScreen, java.util.List<IConfigElement> configElements, java.lang.String modID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title)`
- `GuiConfig(GuiScreen parentScreen, java.util.List<IConfigElement> configElements, java.lang.String modID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title, java.lang.String titleLine2)`
- `GuiConfig(GuiScreen parentScreen, java.util.List<IConfigElement> configElements, java.lang.String modID, java.lang.String configID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title)`
- `GuiConfig(GuiScreen parentScreen, java.util.List<IConfigElement> configElements, java.lang.String modID, java.lang.String configID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title, java.lang.String titleLine2)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`
- `static java.lang.String getAbridgedConfigPath(java.lang.String path)`
- `void handleMouseInput()`
- `void initGui()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void mouseClicked(int x, int y, int mouseEvent)`
- `protected void mouseReleased(int x, int y, int mouseEvent)`
- `void onGuiClosed()`
- `void updateScreen()`

## Fields

- `boolean allRequireMcRestart`
- `boolean allRequireWorldRestart`
- `protected GuiButtonExt btnDefaultAll`
- `protected GuiButtonExt btnUndoAll`
- `protected HoverChecker checkBoxHoverChecker`
- `protected GuiCheckBox chkApplyGlobally`
- `java.util.List<IConfigElement> configElements`
- `java.lang.String configID` — When set to a non-null value the OnConfigChanged and PostConfigChanged events will be posted when the Done button is pressed if any configElements were changed (includes child screens).
- `GuiConfigEntries entryList`
- `java.util.List<GuiConfigEntries.IConfigEntry> initEntries`
- `boolean isWorldRunning`
- `java.lang.String modID`
- `boolean needsRefresh`
- `GuiScreen parentScreen` — A reference to the screen object that created this.
- `protected HoverChecker resetHoverChecker`
- `java.lang.String title`
- `java.lang.String titleLine2`
- `protected HoverChecker undoHoverChecker`
