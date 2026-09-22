# GuiEditArrayEntries.BooleanEntry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.config.GuiEditArrayEntries.BaseEntry → net.minecraftforge.fml.client.config.GuiEditArrayEntries.BooleanEntry

## Class signature

```java
public static class GuiEditArrayEntries.BooleanEntry extends GuiEditArrayEntries.BaseEntry
```

## Constructors

- `BooleanEntry(GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement, boolean value)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partial)`
- `java.lang.Object getValue()`
- `boolean mousePressed(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int index, int x, int y, int mouseEvent, int relativeX, int relativeY)`

## Fields

- `protected GuiButtonExt btnValue`