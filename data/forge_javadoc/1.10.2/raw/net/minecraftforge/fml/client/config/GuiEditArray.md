---
title: "GuiEditArray"
description: "This class is the base screen used for editing an array-type property. It provides a list of array entries for the user to edit. This screen is invoked from a GuiConfig screen by controls that use the"
package: "net/minecraftforge/fml/client/config"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/client/config/GuiEditArray.html"
sourceType: javadoc
---

# GuiEditArray

## Class signature

```java
public class GuiEditArray extends GuiScreen
```

## Constructors

- `public GuiEditArray( GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.lang.Object[] currentValues, boolean enabled)`

## Methods

- `public void initGui()`
- `protected void actionPerformed( GuiButton button)`
- `public void handleMouseInput() throws java.io.IOException`
- `protected void mouseClicked(int x, int y, int mouseEvent) throws java.io.IOException`
- `protected void mouseReleased(int x, int y, int mouseEvent)`
- `protected void keyTyped(char eventChar, int eventKey)`
- `public void updateScreen()`
- `public void drawScreen(int par1, int par2, float par3)`
- `public void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`

## Description

This class is the base screen used for editing an array-type property. It provides a list of array entries for the user to edit. This screen is invoked from a GuiConfig screen by controls that use the
