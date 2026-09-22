# GuiOptions

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiOptions

## Class signature

```java
public class GuiOptions extends GuiScreen implements GuiYesNoCallback
```

## Constructors

- `GuiOptions(GuiScreen p_i1046_1_, GameSettings p_i1046_2_)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `java.lang.String func_175355_a(EnumDifficulty p_175355_1_)`
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.

## Fields

- `protected java.lang.String field_146442_a`