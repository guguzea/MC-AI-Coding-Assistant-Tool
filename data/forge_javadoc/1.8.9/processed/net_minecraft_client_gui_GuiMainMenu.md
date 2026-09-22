# GuiMainMenu

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiMainMenu

## Class signature

```java
public class GuiMainMenu extends GuiScreen implements GuiYesNoCallback
```

## Constructors

- `GuiMainMenu()`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `static java.lang.String field_96138_a`