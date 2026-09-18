# CompoundDataFixer

## Class signature

```java
public class CompoundDataFixer extends DataFixer
```

## Constructors

- `public CompoundDataFixer( DataFixer vanilla)`

## Methods

- `public NBTTagCompound process( IFixType type, NBTTagCompound nbt)`
- `@Deprecated public NBTTagCompound process( IFixType type, NBTTagCompound nbt, int mcversion)`
- `@Deprecated public void registerFix( IFixType type, IFixableData fixable)`
- `@Deprecated public void registerWalker( FixTypes type, IDataWalker walker)`
- `public void registerVanillaWalker( IFixType type, IDataWalker walker)`
- `public ModFixs init(java.lang.String modid, int version)`
- `public void writeVersionData( NBTTagCompound nbt)`

## Description

Initialize your mod specific data fixer.