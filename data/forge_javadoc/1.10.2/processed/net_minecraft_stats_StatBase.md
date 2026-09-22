# StatBase

**Inheritance:** java.lang.Object → net.minecraft.stats.StatBase

## Class signature

```java
public class StatBase extends java.lang.Object
```

## Constructors

- `StatBase(java.lang.String statIdIn, ITextComponent statNameIn)`
- `StatBase(java.lang.String statIdIn, ITextComponent statNameIn, IStatType formatterIn)`

## Methods

- `ITextComponent createChatComponent()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.String format(int number)`
- `IScoreCriteria getCriteria()`
- `java.lang.Class<? extends IJsonSerializable> getSerializableClazz()`
- `ITextComponent getStatName()`
- `int hashCode()`
- `StatBase initIndependentStat()`
- `boolean isAchievement()`
- `StatBase registerStat()`
- `StatBase setSerializableClazz(java.lang.Class<? extends IJsonSerializable> clazz)`
- `java.lang.String toString()`

## Fields

- `static IStatType distanceStatType`
- `static IStatType divideByTen`
- `boolean isIndependent`
- `static IStatType simpleStatType`
- `java.lang.String statId`
- `static IStatType timeStatType`