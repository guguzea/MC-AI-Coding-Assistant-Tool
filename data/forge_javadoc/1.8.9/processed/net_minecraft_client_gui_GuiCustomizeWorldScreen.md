# GuiCustomizeWorldScreen

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiCustomizeWorldScreen

## Class signature

```java
public class GuiCustomizeWorldScreen extends GuiScreen implements GuiSlider.FormatHelper, GuiPageButtonList.GuiResponder
```

## Constructors

- `GuiCustomizeWorldScreen(GuiScreen p_i45521_1_, java.lang.String p_i45521_2_)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void func_175319_a(int p_175319_1_, java.lang.String p_175319_2_)`
- `void func_175321_a(int p_175321_1_, boolean p_175321_2_)`
- `java.lang.String func_175323_a()`
- `void func_175324_a(java.lang.String p_175324_1_)`
- `java.lang.String getText(int id, java.lang.String name, float value)`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.
- `void onTick(int id, float value)`

## Fields

- `protected java.lang.String field_175333_f`
- `protected java.lang.String field_175335_g`
- `protected java.lang.String field_175341_a`
- `protected java.lang.String[] field_175342_h`