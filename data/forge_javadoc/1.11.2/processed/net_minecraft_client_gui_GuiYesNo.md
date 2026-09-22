# GuiYesNo

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiYesNo

## Class signature

```java
public class GuiYesNo extends GuiScreen
```

## Constructors

- `GuiYesNo(GuiYesNoCallback parentScreenIn, java.lang.String messageLine1In, java.lang.String messageLine2In, int parentButtonClickedIdIn)`
- `GuiYesNo(GuiYesNoCallback parentScreenIn, java.lang.String messageLine1In, java.lang.String messageLine2In, java.lang.String confirmButtonTextIn, java.lang.String cancelButtonTextIn, int parentButtonClickedIdIn)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `void initGui()`
- `void setButtonDelay(int ticksUntilEnableIn)`
- `void updateScreen()`

## Fields

- `protected java.lang.String cancelButtonText`
- `protected java.lang.String confirmButtonText`
- `protected java.lang.String messageLine1`
- `protected int parentButtonClickedId`
- `protected GuiYesNoCallback parentScreen`