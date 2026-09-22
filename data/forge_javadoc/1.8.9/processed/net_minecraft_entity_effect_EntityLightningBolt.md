# EntityLightningBolt

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.effect.EntityWeatherEffect → net.minecraft.entity.effect.EntityLightningBolt

## Class signature

```java
public class EntityLightningBolt extends EntityWeatherEffect
```

## Constructors

- `EntityLightningBolt(World worldIn, double posX, double posY, double posZ)`

## Methods

- `protected void entityInit()`
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `long boltVertex` — A random long that is used to change the vertex of the lightning rendered in RenderLightningBolt