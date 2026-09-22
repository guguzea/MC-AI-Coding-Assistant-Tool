# GuiConfigEntries

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot → net.minecraft.client.gui.GuiListExtended → net.minecraftforge.fml.client.config.GuiConfigEntries

## Class signature

```java
public class GuiConfigEntries extends GuiListExtended
```

## Constructors

- `GuiConfigEntries(GuiConfig parent, Minecraft mc)`

## Methods

- `boolean areAllEntriesDefault(boolean includeChildren)` — Returns true if all IConfigEntry objects on this screen are set to default.
- `boolean areAnyEntriesEnabled(boolean includeChildren)` — Returns true if any IConfigEntry objects on this screen are enabled.
- `void drawScreenPost(int mouseX, int mouseY, float partialTicks)` — Calls the drawToolTip() method for all IConfigEntry objects on this screen.
- `GuiConfigEntries.IConfigEntry getListEntry(int index)` — Gets the IGuiListEntry object for the given index
- `int getListWidth()` — Gets the width of the list
- `int getScrollBarX()`
- `int getSize()`
- `boolean hasChangedEntry(boolean includeChildren)` — Returns true if any IConfigEntry objects on this screen are changed.
- `protected void initGui()`
- `void keyTyped(char eventChar, int eventKey)` — This method is a pass-through for IConfigEntry objects that require keystrokes.
- `void mouseClickedPassThru(int mouseX, int mouseY, int mouseEvent)` — This method is a pass-through for IConfigEntry objects that contain GuiTextField elements.
- `void onGuiClosed()` — This method is a pass-through for IConfigEntry objects that need to perform actions when the containing GUI is closed.
- `boolean saveConfigElements()` — Saves all properties on this screen / child screens.
- `void setAllToDefault(boolean includeChildren)` — Sets all IConfigEntry objects on this screen to default.
- `void undoAllChanges(boolean includeChildren)` — Reverts changes to all IConfigEntry objects on this screen.
- `void updateScreen()` — This method is a pass-through for IConfigEntry objects that contain GuiTextField elements.

## Fields

- `int controlWidth` — The width of the control.
- `int controlX` — The x position where the control should be drawn.
- `int labelX` — The x position where the label should be drawn.
- `java.util.List<GuiConfigEntries.IConfigEntry> listEntries`
- `int maxEntryRightBound` — The max x boundary of all IConfigEntry objects.
- `int maxLabelTextWidth` — The max width of the label of all IConfigEntry objects.
- `Minecraft mc`
- `GuiConfig owningScreen`
- `int resetX` — The minimum x position where the Undo/Default buttons will start
- `int scrollBarX` — The x position of the scroll bar.