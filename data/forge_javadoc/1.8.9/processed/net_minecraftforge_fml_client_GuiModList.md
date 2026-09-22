# GuiModList

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.GuiModList

## Class signature

```java
public class GuiModList extends GuiScreen
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `int drawLine(java.lang.String line, int offset, int shifty)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char c, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `boolean modIndexSelected(int index)`
- `protected void mouseClicked(int x, int y, int button)` — Called when the mouse is clicked.
- `void selectModIndex(int index)`
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiModList`