# GuiSelectString

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.config.GuiSelectString

## Class signature

```java
public class GuiSelectString extends GuiScreen
```

## Constructors

- `GuiSelectString(GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.util.Map<java.lang.Object, java.lang.String> selectableValues, java.lang.Object currentValue, boolean enabled)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int par1, int par2, float par3)` — Draws the screen and all the components in it.
- `void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void mouseReleased(int x, int y, int mouseEvent)` — Called when a mouse button is released.

## Fields

- `java.lang.Object beforeValue`
- `protected GuiButtonExt btnDefault`
- `protected GuiButtonExt btnDone`
- `protected GuiButtonExt btnUndoChanges`
- `protected IConfigElement configElement`
- `java.lang.Object currentValue`
- `protected boolean enabled`
- `protected GuiSelectStringEntries entryList`
- `protected GuiScreen parentScreen`
- `protected java.util.Map<java.lang.Object, java.lang.String> selectableValues`
- `protected int slotIndex`
- `protected java.lang.String title`
- `protected java.lang.String titleLine2`
- `protected java.lang.String titleLine3`
- `protected java.util.List<java.lang.String> toolTip`
- `protected HoverChecker tooltipHoverChecker`