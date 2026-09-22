# CompoundDataFixer

**Inheritance:** java.lang.Object → net.minecraft.util.datafix.DataFixer → net.minecraftforge.common.util.CompoundDataFixer

## Class signature

```java
public class CompoundDataFixer extends DataFixer
```

## Methods

- `ModFixs init(java.lang.String modid, int version)` — Initialize your mod specific data fixer.
- `NBTTagCompound process(IFixType type, NBTTagCompound nbt)`
- `@Deprecated NBTTagCompound process(IFixType type, NBTTagCompound nbt, int mcversion)`
- `@Deprecated void registerFix(IFixType type, IFixableData fixable)`
- `void registerVanillaWalker(IFixType type, IDataWalker walker)`
- `@Deprecated void registerWalker(FixTypes type, IDataWalker walker)`
- `void writeVersionData(NBTTagCompound nbt)`

## Fields

- `CompoundDataFixer`