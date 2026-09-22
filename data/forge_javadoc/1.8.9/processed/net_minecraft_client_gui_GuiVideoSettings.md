# GuiVideoSettings

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiVideoSettings

## Class signature

```java
public class GuiVideoSettings extends GuiScreen
```

## Constructors

- `GuiVideoSettings(GuiScreen parentScreenIn, GameSettings gameSettingsIn)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.

## Fields

- `protected java.lang.String screenTitle`