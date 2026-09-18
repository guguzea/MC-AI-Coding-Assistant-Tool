# StatisticsManagerServer

## Class signature

```java
public class StatisticsManagerServer extends StatisticsManager
```

## Constructors

- `public StatisticsManagerServer( MinecraftServer serverIn, java.io.File statsFileIn)`

## Methods

- `public void readStatFile()`
- `public void saveStatFile()`
- `public void unlockAchievement( EntityPlayer playerIn, StatBase statIn, int p_150873_3_)`
- `public java.util.Map< StatBase , TupleIntJsonSerializable > parseJson(java.lang.String p_150881_1_)`
- `public static java.lang.String dumpJson(java.util.Map< StatBase , TupleIntJsonSerializable > p_150880_0_)`
- `public void markAllDirty()`
- `public void sendStats( EntityPlayerMP player)`