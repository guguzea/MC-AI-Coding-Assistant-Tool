# GuiScreenDemo

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiScreenDemo

## Class signature

```java
public class GuiScreenDemo extends GuiScreen
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawDefaultBackground()` — Draws either a gradient over the background screen (when it exists) or a flat gradient over background.png
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiScreenDemo`