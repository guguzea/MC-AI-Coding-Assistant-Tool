# ServerListEntryLanDetected

**Inheritance:** java.lang.Object → net.minecraft.client.gui.ServerListEntryLanDetected

## Class signature

```java
public class ServerListEntryLanDetected extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `ServerListEntryLanDetected(GuiMultiplayer screenIn, LanServerDetector.LanServer serverDataIn)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `LanServerDetector.LanServer getLanServer()`
- `boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`

## Fields

- `protected Minecraft mc`
- `protected LanServerDetector.LanServer serverData`