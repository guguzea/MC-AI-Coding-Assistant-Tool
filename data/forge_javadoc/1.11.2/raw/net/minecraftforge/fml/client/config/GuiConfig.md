---
title: "GuiConfig"
description: "This class is the base GuiScreen for all config GUI screens. It can be extended by mods to provide the top-level config screen that will be called when the Config button is clicked from the Main Menu "
package: "net/minecraftforge/fml/client/config"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/config/GuiConfig.html"
sourceType: javadoc
---

# GuiConfig

## Class signature

```java
public class GuiConfig extends GuiScreen
```

## Constructors

- `public GuiConfig( GuiScreen parentScreen, java.util.List< IConfigElement > configElements, java.lang.String modID, java.lang.String configID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title)`
- `public GuiConfig( GuiScreen parentScreen, java.util.List< IConfigElement > configElements, java.lang.String modID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title)`
- `public GuiConfig( GuiScreen parentScreen, java.util.List< IConfigElement > configElements, java.lang.String modID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title, java.lang.String titleLine2)`
- `public GuiConfig( GuiScreen parentScreen, java.util.List< IConfigElement > configElements, java.lang.String modID, @Nullable java.lang.String configID, boolean allRequireWorldRestart, boolean allRequireMcRestart, java.lang.String title, @Nullable java.lang.String titleLine2)`

## Methods

- `public static java.lang.String getAbridgedConfigPath(java.lang.String path)`
- `public void initGui()`
- `public void onGuiClosed()`
- `protected void actionPerformed( GuiButton button)`
- `public void handleMouseInput() throws java.io.IOException`
- `protected void mouseClicked(int x, int y, int mouseEvent) throws java.io.IOException`
- `protected void mouseReleased(int x, int y, int mouseEvent)`
- `protected void keyTyped(char eventChar, int eventKey)`
- `public void updateScreen()`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`

## Description

This class is the base GuiScreen for all config GUI screens. It can be extended by mods to provide the top-level config screen that will be called when the Config button is clicked from the Main Menu 
