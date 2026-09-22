# GuiEditArrayEntries.StringEntry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.config.GuiEditArrayEntries.BaseEntry → cpw.mods.fml.client.config.GuiEditArrayEntries.StringEntry

## Class signature

```java
public static class GuiEditArrayEntries.StringEntry extends GuiEditArrayEntries.BaseEntry
```

## Constructors

- `StringEntry(GuiEditArray owningScreen, GuiEditArrayEntries owningEntryList, IConfigElement configElement, java.lang.Object value)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, Tessellator tessellator, int mouseX, int mouseY, boolean isSelected)`
- `java.lang.Object getValue()`
- `void keyTyped(char eventChar, int eventKey)`
- `void mouseClicked(int x, int y, int mouseEvent)`
- `void updateCursorCounter()`

## Fields

- `protected GuiTextField textFieldValue`