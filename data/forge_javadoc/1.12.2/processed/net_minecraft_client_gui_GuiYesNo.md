# GuiYesNo

## Class signature

```java
public class GuiYesNo extends GuiScreen
```

## Constructors

- `public GuiYesNo( GuiYesNoCallback parentScreenIn, java.lang.String messageLine1In, java.lang.String messageLine2In, int parentButtonClickedIdIn)`
- `public GuiYesNo( GuiYesNoCallback parentScreenIn, java.lang.String messageLine1In, java.lang.String messageLine2In, java.lang.String confirmButtonTextIn, java.lang.String cancelButtonTextIn, int parentButtonClickedIdIn)`

## Methods

- `public void initGui()`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void setButtonDelay(int ticksUntilEnableIn)`
- `public void updateScreen()`