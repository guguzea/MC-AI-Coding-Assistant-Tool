# StatFileWriter

**Inheritance:** java.lang.Object → net.minecraft.stats.StatFileWriter

## Class signature

```java
public class StatFileWriter extends java.lang.Object
```

## Constructors

- `StatFileWriter()`

## Methods

- `boolean canUnlockAchievement(Achievement achievementIn)` — Returns true if the parent has been unlocked, or there is no parent
- `<T extends IJsonSerializable> T func_150870_b(StatBase p_150870_1_)`
- `<T extends IJsonSerializable> T func_150872_a(StatBase p_150872_1_, T p_150872_2_)`
- `int func_150874_c(Achievement p_150874_1_)`
- `boolean hasAchievementUnlocked(Achievement achievementIn)` — Returns true if the achievement has been unlocked.
- `void increaseStat(EntityPlayer player, StatBase stat, int amount)`
- `int readStat(StatBase stat)` — Reads the given stat and returns its value as an int.
- `void unlockAchievement(EntityPlayer playerIn, StatBase statIn, int p_150873_3_)` — Triggers the logging of an achievement and attempts to announce to server

## Fields

- `protected java.util.Map<StatBase, TupleIntJsonSerializable> statsData`