# EntityMinecartFurnace

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.item.EntityMinecartFurnace

## Class signature

```java
public class EntityMinecartFurnace extends EntityMinecart
```

## Constructors

- `EntityMinecartFurnace(World worldIn)`
- `EntityMinecartFurnace(World worldIn, double x, double y, double z)`

## Methods

- `protected void applyDrag()`
- `protected void entityInit()`
- `IBlockState getDefaultDisplayTile()`
- `protected double getMaximumSpeed()`
- `EntityMinecart.Type getType()`
- `protected boolean isMinecartPowered()`
- `void killMinecart(DamageSource source)`
- `protected void moveAlongTrack(BlockPos pos, IBlockState state)`
- `void onUpdate()`
- `boolean processInitialInteract(EntityPlayer player, ItemStack stack, EnumHand hand)`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesMinecartFurnace(DataFixer fixer)`
- `protected void setMinecartPowered(boolean p_94107_1_)`
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `double pushX`
- `double pushZ`