# GuiResourcePackList

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot → net.minecraft.client.gui.GuiListExtended → net.minecraft.client.gui.GuiResourcePackList

## Class signature

```java
public abstract class GuiResourcePackList extends GuiListExtended
```

## Constructors

- `GuiResourcePackList(Minecraft mcIn, int p_i45055_2_, int p_i45055_3_, java.util.List<ResourcePackListEntry> p_i45055_4_)`

## Methods

- `protected void drawListHeader(int p_148129_1_, int p_148129_2_, Tessellator p_148129_3_)` — Handles drawing a list's header row.
- `java.util.List<ResourcePackListEntry> getList()`
- `ResourcePackListEntry getListEntry(int index)` — Gets the IGuiListEntry object for the given index
- `protected abstract java.lang.String getListHeader()`
- `int getListWidth()` — Gets the width of the list
- `protected int getScrollBarX()`
- `protected int getSize()`

## Fields

- `protected java.util.List<ResourcePackListEntry> field_148204_l`
- `protected Minecraft mc`