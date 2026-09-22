---
title: "GuiCustomizeWorldScreen"
description: "public class GuiCustomizeWorldScreen extends GuiScreen implements GuiSlider.FormatHelper, GuiPageButtonList.GuiResponder"
package: "net/minecraft/client/gui"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/gui/GuiCustomizeWorldScreen.html"
sourceType: javadoc
---

# GuiCustomizeWorldScreen

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiCustomizeWorldScreen

## Class signature

```java
public class GuiCustomizeWorldScreen extends GuiScreen implements GuiSlider.FormatHelper, GuiPageButtonList.GuiResponder
```

## Constructors

- `GuiCustomizeWorldScreen(GuiScreen parentIn, java.lang.String p_i45521_2_)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `java.lang.String getText(int id, java.lang.String name, float value)`
- `void handleMouseInput()`
- `void initGui()`
- `protected void keyTyped(char typedChar, int keyCode)`
- `void loadValues(java.lang.String p_175324_1_)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `java.lang.String saveValues()`
- `void setEntryValue(int id, boolean value)`
- `void setEntryValue(int id, float value)`
- `void setEntryValue(int id, java.lang.String value)`

## Fields

- `protected java.lang.String[] pageNames`
- `protected java.lang.String pageTitle`
- `protected java.lang.String subtitle`
- `protected java.lang.String title`
