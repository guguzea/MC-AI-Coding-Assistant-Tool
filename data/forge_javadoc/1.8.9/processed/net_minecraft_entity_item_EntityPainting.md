# EntityPainting

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityHanging → net.minecraft.entity.item.EntityPainting

## Class signature

```java
public class EntityPainting extends EntityHanging
```

## Constructors

- `EntityPainting(World worldIn)`
- `EntityPainting(World worldIn, BlockPos pos, EnumFacing facing)`
- `EntityPainting(World worldIn, BlockPos pos, EnumFacing facing, java.lang.String title)`

## Methods

- `int getHeightPixels()`
- `int getWidthPixels()`
- `void onBroken(Entity brokenEntity)` — Called when this entity is broken.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)` — Sets the location and Yaw/Pitch of an entity in the world
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityPainting.EnumArt art`