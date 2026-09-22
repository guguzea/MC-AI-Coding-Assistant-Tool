# GuiEditArray

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.config.GuiEditArray

## Class signature

```java
public class GuiEditArray extends GuiScreen
```

## Constructors

- `GuiEditArray(GuiScreen parentScreen, IConfigElement configElement, int slotIndex, java.lang.Object[] currentValues, boolean enabled)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int par1, int par2, float par3)` — Draws the screen and all the components in it.
- `void drawToolTip(java.util.List<java.lang.String> stringList, int x, int y)`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char eventChar, int eventKey)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int x, int y, int mouseEvent)` — Called when the mouse is clicked.
- `protected void mouseReleased(int x, int y, int mouseEvent)` — Called when a mouse button is released.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `protected java.lang.Object[] beforeValues`
- `protected GuiButtonExt btnDefault`
- `protected GuiButtonExt btnDone`
- `protected GuiButtonExt btnUndoChanges`
- `protected IConfigElement configElement`
- `protected java.lang.Object[] currentValues`
- `protected boolean enabled`
- `protected GuiEditArrayEntries entryList`
- `protected GuiScreen parentScreen`
- `protected int slotIndex`
- `protected java.lang.String title`
- `protected java.lang.String titleLine2`
- `protected java.lang.String titleLine3`
- `protected java.util.List<java.lang.String> toolTip`
- `protected HoverChecker tooltipHoverChecker`