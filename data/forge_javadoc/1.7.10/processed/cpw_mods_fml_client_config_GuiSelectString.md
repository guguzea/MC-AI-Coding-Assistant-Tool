# GuiSelectString

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → cpw.mods.fml.client.config.GuiSelectString

## Class signature

```java
public class GuiSelectString extends GuiScreen
```

## Constructors

- `GuiSelectString(GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.util.Map<java.lang.Object, java.lang.String> selectableValues, java.lang.Object currentValue, boolean enabled)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int par1, int par2, float par3)`
- `void drawToolTip(java.util.List stringList, int x, int y)`
- `void initGui()`
- `protected void mouseMovedOrUp(int x, int y, int mouseEvent)`

## Fields

- `java.lang.Object beforeValue`
- `protected IConfigElement configElement`
- `java.lang.Object currentValue`
- `protected boolean enabled`
- `protected GuiScreen parentScreen`
- `protected int slotIndex`
- `protected java.lang.String titleLine2`
- `protected java.lang.String titleLine3`