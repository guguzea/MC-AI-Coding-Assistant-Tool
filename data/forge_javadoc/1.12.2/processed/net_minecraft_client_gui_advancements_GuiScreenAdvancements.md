# GuiScreenAdvancements

## Class signature

```java
public class GuiScreenAdvancements extends GuiScreen implements ClientAdvancementManager.IListener
```

## Constructors

- `public GuiScreenAdvancements( ClientAdvancementManager p_i47383_1_)`

## Methods

- `public void initGui()`
- `public void onGuiClosed()`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void renderWindow(int p_191934_1_, int p_191934_2_)`
- `public void rootAdvancementAdded( Advancement advancementIn)`
- `public void rootAdvancementRemoved( Advancement advancementIn)`
- `public void nonRootAdvancementAdded( Advancement advancementIn)`
- `public void nonRootAdvancementRemoved( Advancement advancementIn)`
- `public void onUpdateAdvancementProgress( Advancement p_191933_1_, AdvancementProgress p_191933_2_)`
- `public void setSelectedTab( Advancement p_193982_1_)`
- `public void advancementsCleared()`
- `public GuiAdvancement getAdvancementGui( Advancement p_191938_1_)`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`