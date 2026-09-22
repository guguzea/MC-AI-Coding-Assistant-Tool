# GuiLanguage

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiLanguage

## Class signature

```java
public class GuiLanguage extends GuiScreen
```

## Constructors

- `GuiLanguage(GuiScreen screen, GameSettings gameSettingsObj, LanguageManager manager)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.

## Fields

- `protected GuiScreen parentScreen` — The parent Gui screen