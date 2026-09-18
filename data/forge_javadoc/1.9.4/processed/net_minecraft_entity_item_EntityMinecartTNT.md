# EntityMinecartTNT

## Class signature

```java
public class EntityMinecartTNT extends EntityMinecart
```

## Constructors

- `public EntityMinecartTNT( World worldIn)`
- `public EntityMinecartTNT( World worldIn, double x, double y, double z)`

## Methods

- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `public void onUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void killMinecart( DamageSource source)`
- `protected void explodeCart(double p_94103_1_)`
- `public void fall(float distance, float damageMultiplier)`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public void handleStatusUpdate(byte id)`
- `public void ignite()`
- `public int getFuseTicks()`
- `public boolean isIgnited()`
- `public float getExplosionResistance( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)`
- `public boolean verifyExplosion( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn, float p_174816_5_)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`