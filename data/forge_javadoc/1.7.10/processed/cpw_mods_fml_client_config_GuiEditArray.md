# GuiEditArray

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → cpw.mods.fml.client.config.GuiEditArray

## Class signature

```java
public class GuiEditArray extends GuiScreen
```

## Constructors

- `GuiEditArray(GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.lang.Object[] currentValues, boolean enabled)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int par1, int par2, float par3)`
- `void drawToolTip(java.util.List stringList, int x, int y)`
- `void initGui()`
- `protected void keyTyped(char eventChar, int eventKey)`
- `protected void mouseClicked(int x, int y, int mouseEvent)`
- `protected void mouseMovedOrUp(int x, int y, int mouseEvent)`
- `void updateScreen()`

## Fields

- `protected IConfigElement configElement`
- `protected boolean enabled`
- `protected GuiScreen parentScreen`
- `protected int slotIndex`
- `protected java.lang.String titleLine2`
- `protected java.lang.String titleLine3`