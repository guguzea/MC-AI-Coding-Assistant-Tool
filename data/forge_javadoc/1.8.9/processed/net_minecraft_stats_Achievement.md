# Achievement

**Inheritance:** java.lang.Object → net.minecraft.stats.StatBase → net.minecraft.stats.Achievement

## Class signature

```java
public class Achievement extends StatBase
```

## Constructors

- `Achievement(java.lang.String p_i45301_1_, java.lang.String p_i45301_2_, int column, int row, Block p_i45301_5_, Achievement parent)`
- `Achievement(java.lang.String p_i46327_1_, java.lang.String p_i46327_2_, int column, int row, Item p_i46327_5_, Achievement parent)`
- `Achievement(java.lang.String p_i45302_1_, java.lang.String p_i45302_2_, int column, int row, ItemStack p_i45302_5_, Achievement parent)`

## Methods

- `Achievement func_150953_b(java.lang.Class<? extends IJsonSerializable> p_150953_1_)`
- `java.lang.String getDescription()` — Returns the fully description of the achievement - ready to be displayed on screen.
- `boolean getSpecial()` — Special achievements have a 'spiked' (on normal texture pack) frame, special achievements are the hardest ones to achieve.
- `IChatComponent getStatName()`
- `Achievement initIndependentStat()` — Initializes the current stat as independent (i.e., lacking prerequisites for being updated) and returns the current instance.
- `boolean isAchievement()` — Returns whether or not the StatBase-derived class is a statistic (running counter) or an achievement (one-shot).
- `Achievement registerStat()` — Register the stat into StatList.
- `Achievement setSpecial()` — Special achievements have a 'spiked' (on normal texture pack) frame, special achievements are the hardest ones to achieve.
- `Achievement setStatStringFormatter(IStatStringFormat p_75988_1_)` — Defines a string formatter for the achievement.

## Fields

- `int displayColumn` — Is the column (related to center of achievement gui, in 24 pixels unit) that the achievement will be displayed.
- `int displayRow` — Is the row (related to center of achievement gui, in 24 pixels unit) that the achievement will be displayed.
- `Achievement parentAchievement` — Holds the parent achievement, that must be taken before this achievement is avaiable.
- `ItemStack theItemStack` — Holds the ItemStack that will be used to draw the achievement into the GUI.