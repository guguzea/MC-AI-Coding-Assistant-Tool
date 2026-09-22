# GuiAchievements

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.achievement.GuiAchievements

## Class signature

```java
public class GuiAchievements extends GuiScreen implements IProgressMeter
```

## Constructors

- `GuiAchievements(GuiScreen parentScreenIn, StatisticsManager statFileWriterIn)`

## Methods

- `protected void actionPerformed(GuiButton button)`
- `boolean doesGuiPauseGame()`
- `void doneLoading()`
- `protected void drawAchievementScreen(int p_146552_1_, int p_146552_2_, float p_146552_3_)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void drawTitle()`
- `void initGui()`
- `protected void keyTyped(char typedChar, int keyCode)`
- `void updateScreen()`

## Fields

- `protected int imageHeight`
- `protected int imageWidth`
- `protected GuiScreen parentScreen`
- `protected int xLastScroll`
- `protected double xScrollO`
- `protected double xScrollP`
- `protected double xScrollTarget`
- `protected int yLastScroll`
- `protected double yScrollO`
- `protected double yScrollP`
- `protected double yScrollTarget`
- `protected float zoom`