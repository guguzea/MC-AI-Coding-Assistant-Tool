---
title: "GuiConfig"
description: "public class GuiConfig extends GuiScreen"
package: "cpw/mods/fml/client/config"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/config/GuiConfig.html"
sourceType: javadoc
---

# GuiConfig

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → cpw.mods.fml.client.config.GuiConfig

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
- `void drawToolTip(java.util.List stringList, int x, int y)`
- `static java.lang.String getAbridgedConfigPath(java.lang.String path)`
- `void initGui()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void mouseClicked(int x, int y, int mouseEvent)`
- `protected void mouseMovedOrUp(int x, int y, int mouseEvent)`
- `void onGuiClosed()`
- `void updateScreen()`

## Fields

- `boolean allRequireMcRestart`
- `boolean allRequireWorldRestart`
- `java.util.List<IConfigElement> configElements`
- `java.lang.String configID` — When set to a non-null value the OnConfigChanged and PostConfigChanged events will be posted when the Done button is pressed if any configElements were changed (includes child screens).
- `GuiConfigEntries entryList`
- `java.util.List<GuiConfigEntries.IConfigEntry> initEntries`
- `boolean isWorldRunning`
- `java.lang.String modID`
- `boolean needsRefresh`
- `GuiScreen parentScreen` — A reference to the screen object that created this.
- `java.lang.String title`
- `java.lang.String titleLine2`
