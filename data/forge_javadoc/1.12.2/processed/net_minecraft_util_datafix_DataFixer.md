# DataFixer

**Inheritance:** java.lang.Object → net.minecraft.util.datafix.DataFixer

## Class signature

```java
public class DataFixer extends java.lang.Object implements IDataFixer
```

## Constructors

- `DataFixer(int versionIn)`

## Methods

- `NBTTagCompound process(IFixType type, NBTTagCompound compound)`
- `NBTTagCompound process(IFixType type, NBTTagCompound compound, int versionIn)`
- `void registerFix(IFixType type, IFixableData fixable)`
- `void registerVanillaWalker(IFixType type, IDataWalker walker)`
- `void registerWalker(FixTypes type, IDataWalker walker)`

## Fields

- `int version`