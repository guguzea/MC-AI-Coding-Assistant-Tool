# GuiEditArrayEntries.BooleanEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiEditArrayEntries.BaseEntry → cpw.mods.fml.client.config.GuiEditArrayEntries.BooleanEntry

## Class signature

```java
public static class GuiEditArrayEntries.BooleanEntry extends GuiEditArrayEntries.BaseEntry
```

## Constructors

- `BooleanEntry(GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement, boolean value)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `java.lang.Object getValue()`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`

## Fields

- `protected GuiButtonExt btnValue`