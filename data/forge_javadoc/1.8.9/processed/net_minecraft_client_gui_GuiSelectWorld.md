# GuiSelectWorld

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiSelectWorld

## Class signature

```java
public class GuiSelectWorld extends GuiScreen implements GuiYesNoCallback
```

## Constructors

- `GuiSelectWorld(GuiScreen parentScreenIn)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `protected java.lang.String func_146614_d(int p_146614_1_)`
- `void func_146615_e(int p_146615_1_)`
- `void func_146618_g()`
- `protected java.lang.String func_146621_a(int p_146621_1_)`
- `static GuiYesNo func_152129_a(GuiYesNoCallback p_152129_0_, java.lang.String p_152129_1_, int p_152129_2_)`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.

## Fields

- `protected java.lang.String field_146628_f`
- `protected GuiScreen parentScreen`