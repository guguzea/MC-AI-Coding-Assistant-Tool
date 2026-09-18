# GuiScreenBook

## Class signature

```java
public class GuiScreenBook extends GuiScreen
```

## Constructors

- `public GuiScreenBook( EntityPlayer player, ItemStack book, boolean isUnsigned)`

## Methods

- `public void updateScreen()`
- `public void initGui()`
- `public void onGuiClosed()`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected boolean handleComponentClick( IChatComponent p_175276_1_)`
- `public IChatComponent func_175385_b(int p_175385_1_, int p_175385_2_)`

## Description

Called by the controls from the buttonList when activated.