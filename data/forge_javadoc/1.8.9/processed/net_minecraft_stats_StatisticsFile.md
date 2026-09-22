# StatisticsFile

**Inheritance:** java.lang.Object → net.minecraft.stats.StatFileWriter → net.minecraft.stats.StatisticsFile

## Class signature

```java
public class StatisticsFile extends StatFileWriter
```

## Methods

- `static java.lang.String dumpJson(java.util.Map<StatBase, TupleIntJsonSerializable> p_150880_0_)`
- `void func_150876_a(EntityPlayerMP p_150876_1_)`
- `void func_150877_d()`
- `java.util.Set<StatBase> func_150878_c()`
- `boolean func_150879_e()`
- `java.util.Map<StatBase, TupleIntJsonSerializable> parseJson(java.lang.String p_150881_1_)`
- `void readStatFile()`
- `void saveStatFile()`
- `void sendAchievements(EntityPlayerMP player)`
- `void unlockAchievement(EntityPlayer playerIn, StatBase statIn, int p_150873_3_)` — Triggers the logging of an achievement and attempts to announce to server

## Fields

- `StatisticsFile`