# DataFixer

## Class signature

```java
public class DataFixer extends java.lang.Object implements IDataFixer
```

## Constructors

- `public DataFixer(int versionIn)`

## Methods

- `public NBTTagCompound process( IFixType type, NBTTagCompound compound)`
- `public NBTTagCompound process( IFixType type, NBTTagCompound compound, int versionIn)`
- `public void registerWalker( FixTypes type, IDataWalker walker)`
- `public void registerWalkerAdd( IFixType type, IDataWalker walker)`
- `public void registerFix( IFixType type, IFixableData fixable)`