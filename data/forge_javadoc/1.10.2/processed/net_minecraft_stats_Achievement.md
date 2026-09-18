# Achievement

## Class signature

```java
public class Achievement extends StatBase
```

## Constructors

- `public Achievement(java.lang.String statIdIn, java.lang.String unlocalizedName, int column, int row, Item itemIn, Achievement parent)`
- `public Achievement(java.lang.String statIdIn, java.lang.String unlocalizedName, int column, int row, Block blockIn, Achievement parent)`
- `public Achievement(java.lang.String statIdIn, java.lang.String unlocalizedName, int column, int row, ItemStack stack, Achievement parent)`

## Methods

- `public Achievement initIndependentStat()`
- `public Achievement setSpecial()`
- `public Achievement registerStat()`
- `public boolean isAchievement()`
- `public ITextComponent getStatName()`
- `public Achievement setSerializableClazz(java.lang.Class<? extends IJsonSerializable > clazz)`
- `public java.lang.String getDescription()`
- `public Achievement setStatStringFormatter( IStatStringFormat statStringFormatterIn)`
- `public boolean getSpecial()`