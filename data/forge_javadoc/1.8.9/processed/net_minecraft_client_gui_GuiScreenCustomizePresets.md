# GuiScreenCustomizePresets

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiScreenCustomizePresets

## Class signature

```java
public class GuiScreenCustomizePresets extends GuiScreen
```

## Constructors

- `GuiScreenCustomizePresets(GuiCustomizeWorldScreen p_i45524_1_)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void func_175304_a()`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `protected java.lang.String field_175315_a`