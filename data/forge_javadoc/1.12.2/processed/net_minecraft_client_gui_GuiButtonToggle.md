# GuiButtonToggle

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiButton → net.minecraft.client.gui.GuiButtonToggle

## Class signature

```java
public class GuiButtonToggle extends GuiButton
```

## Constructors

- `GuiButtonToggle(int buttonId, int xIn, int yIn, int widthIn, int heightIn, boolean buttonText)`

## Methods

- `void drawButton(Minecraft mc, int mouseX, int mouseY, float partialTicks)`
- `void initTextureValues(int xTexStartIn, int yTexStartIn, int xDiffTexIn, int yDiffTexIn, ResourceLocation resourceLocationIn)`
- `boolean isStateTriggered()`
- `void setPosition(int p_191752_1_, int p_191752_2_)`
- `void setStateTriggered(boolean p_191753_1_)`

## Fields

- `protected ResourceLocation resourceLocation`
- `protected boolean stateTriggered`
- `protected int xDiffTex`
- `protected int xTexStart`
- `protected int yDiffTex`
- `protected int yTexStart`