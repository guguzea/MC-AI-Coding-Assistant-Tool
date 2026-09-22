# GuiNotification

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraftforge.fml.client.GuiNotification

## Class signature

```java
public class GuiNotification extends GuiScreen
```

## Constructors

- `GuiNotification(StartupQuery query)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.

## Fields

- `protected StartupQuery query`