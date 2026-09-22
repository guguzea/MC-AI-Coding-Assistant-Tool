# ServerListEntryNormal

**Inheritance:** java.lang.Object → net.minecraft.client.gui.ServerListEntryNormal

## Class signature

```java
public class ServerListEntryNormal extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `ServerListEntryNormal(GuiMultiplayer ownerIn, ServerData serverIn)`

## Methods

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected, float partialTicks)`
- `protected void drawTextureAt(int p_178012_1_, int p_178012_2_, ResourceLocation p_178012_3_)`
- `ServerData getServerData()`
- `boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void updatePosition(int slotIndex, int x, int y, float partialTicks)`