# GuiSelectStringEntries

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot → net.minecraft.client.gui.GuiListExtended → net.minecraftforge.fml.client.config.GuiSelectStringEntries

## Class signature

```java
public class GuiSelectStringEntries extends GuiListExtended
```

## Constructors

- `GuiSelectStringEntries(GuiSelectString owningScreen, Minecraft mc, IConfigElement configElement, java.util.Map<java.lang.Object, java.lang.String> selectableValues)`

## Methods

- `protected void elementClicked(int index, boolean doubleClick, int mouseX, int mouseY)` — The element in the slot that was clicked, boolean for whether it was double clicked or not
- `GuiSelectStringEntries.IGuiSelectStringListEntry getListEntry(int index)`
- `int getListWidth()` — Gets the width of the list
- `protected int getScrollBarX()`
- `protected int getSize()`
- `boolean isChanged()`
- `boolean isDefault()`
- `protected boolean isSelected(int index)` — Returns true if the element passed in is currently selected
- `void saveChanges()`

## Fields

- `IConfigElement configElement`
- `java.util.List<GuiSelectStringEntries.IGuiSelectStringListEntry> listEntries`
- `int maxEntryWidth`
- `Minecraft mc`
- `GuiSelectString owningScreen`
- `java.util.Map<java.lang.Object, java.lang.String> selectableValues`
- `int selectedIndex`