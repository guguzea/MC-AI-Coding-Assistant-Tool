---
title: "GuiEditArray"
description: "public class GuiEditArray extends GuiScreen"
package: "net/minecraftforge/fml/client/config"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/config/GuiEditArray.html"
sourceType: javadoc
---

# GuiEditArray

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.config.GuiEditArray

## Class signature

```java
public class GuiEditArray extends GuiScreen
```

## Constructors

- `GuiEditArray(GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.lang.Object[] currentValues, boolean enabled)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int par1, int par2, float par3)`
- `void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`
- `void handleMouseInput()`
- `void initGui()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void mouseClicked(int x, int y, int mouseEvent)`
- `protected void mouseReleased(int x, int y, int mouseEvent)`
- `void updateScreen()`

## Fields

- `protected java.lang.Object[] beforeValues`
- `protected GuiButtonExt btnDefault`
- `protected GuiButtonExt btnDone`
- `protected GuiButtonExt btnUndoChanges`
- `protected IConfigElement configElement`
- `protected java.lang.Object[] currentValues`
- `protected boolean enabled`
- `protected GuiEditArrayEntries entryList`
- `protected GuiScreen parentScreen`
- `protected int slotIndex`
- `protected java.lang.String title`
- `protected java.lang.String titleLine2`
- `protected java.lang.String titleLine3`
- `protected java.util.List<java.lang.String> toolTip`
- `protected HoverChecker tooltipHoverChecker`
