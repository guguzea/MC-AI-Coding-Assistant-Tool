---
title: "GuiSelectString"
description: "public class GuiSelectString extends GuiScreen"
package: "net/minecraftforge/fml/client/config"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/config/GuiSelectString.html"
sourceType: javadoc
---

# GuiSelectString

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.config.GuiSelectString

## Class signature

```java
public class GuiSelectString extends GuiScreen
```

## Constructors

- `GuiSelectString(GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.util.Map<java.lang.Object, java.lang.String> selectableValues, java.lang.Object currentValue, boolean enabled)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int par1, int par2, float par3)`
- `void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`
- `void handleMouseInput()`
- `void initGui()`
- `protected void mouseReleased(int x, int y, int mouseEvent)`

## Fields

- `java.lang.Object beforeValue`
- `protected GuiButtonExt btnDefault`
- `protected GuiButtonExt btnDone`
- `protected GuiButtonExt btnUndoChanges`
- `protected IConfigElement configElement`
- `java.lang.Object currentValue`
- `protected boolean enabled`
- `protected GuiSelectStringEntries entryList`
- `protected GuiScreen parentScreen`
- `protected java.util.Map<java.lang.Object, java.lang.String> selectableValues`
- `protected int slotIndex`
- `protected java.lang.String title`
- `protected java.lang.String titleLine2`
- `protected java.lang.String titleLine3`
- `protected java.util.List<java.lang.String> toolTip`
- `protected HoverChecker tooltipHoverChecker`
