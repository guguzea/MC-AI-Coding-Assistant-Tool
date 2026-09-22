# GuiYesNo

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiYesNo

## Class signature

```java
public class GuiYesNo extends GuiScreen
```

## Constructors

- `GuiYesNo(GuiYesNoCallback p_i1082_1_, java.lang.String p_i1082_2_, java.lang.String p_i1082_3_, int p_i1082_4_)`
- `GuiYesNo(GuiYesNoCallback p_i1083_1_, java.lang.String p_i1083_2_, java.lang.String p_i1083_3_, java.lang.String p_i1083_4_, java.lang.String p_i1083_5_, int p_i1083_6_)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void setButtonDelay(int p_146350_1_)` — Sets the number of ticks to wait before enabling the buttons.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `protected java.lang.String cancelButtonText` — The text shown for the second button in GuiYesNo
- `protected java.lang.String confirmButtonText` — The text shown for the first button in GuiYesNo
- `protected java.lang.String messageLine1`
- `protected int parentButtonClickedId`
- `protected GuiYesNoCallback parentScreen` — A reference to the screen object that created this.