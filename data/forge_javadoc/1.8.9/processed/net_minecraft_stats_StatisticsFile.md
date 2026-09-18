# StatisticsFile

## Class signature

```java
public class StatisticsFile extends StatFileWriter
```

## Constructors

- `public StatisticsFile( MinecraftServer serverIn, java.io.File statsFileIn)`

## Methods

- `public void readStatFile()`
- `public void saveStatFile()`
- `public void unlockAchievement( EntityPlayer playerIn, StatBase statIn, int p_150873_3_)`
- `public java.util.Set< StatBase > func_150878_c()`
- `public java.util.Map< StatBase , TupleIntJsonSerializable > parseJson(java.lang.String p_150881_1_)`
- `public static java.lang.String dumpJson(java.util.Map< StatBase , TupleIntJsonSerializable > p_150880_0_)`
- `public void func_150877_d()`
- `public void func_150876_a( EntityPlayerMP p_150876_1_)`
- `public void sendAchievements( EntityPlayerMP player)`
- `public boolean func_150879_e()`

## Description

Triggers the logging of an achievement and attempts to announce to server