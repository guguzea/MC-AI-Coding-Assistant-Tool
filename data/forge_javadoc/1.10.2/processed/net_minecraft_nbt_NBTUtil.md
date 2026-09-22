# NBTUtil

**Inheritance:** java.lang.Object → net.minecraft.nbt.NBTUtil

## Class signature

```java
public final class NBTUtil extends java.lang.Object
```

## Constructors

- `NBTUtil()`

## Methods

- `static boolean areNBTEquals(NBTBase nbt1, NBTBase nbt2, boolean compareTagList)`
- `static NBTTagCompound createPosTag(BlockPos pos)`
- `static NBTTagCompound createUUIDTag(java.util.UUID uuid)`
- `static BlockPos getPosFromTag(NBTTagCompound tag)`
- `static java.util.UUID getUUIDFromTag(NBTTagCompound tag)`
- `static IBlockState readBlockState(NBTTagCompound tag)`
- `static com.mojang.authlib.GameProfile readGameProfileFromNBT(NBTTagCompound compound)`
- `static NBTTagCompound writeBlockState(NBTTagCompound tag, IBlockState state)`
- `static NBTTagCompound writeGameProfile(NBTTagCompound tagCompound, com.mojang.authlib.GameProfile profile)`