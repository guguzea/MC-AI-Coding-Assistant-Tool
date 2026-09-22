# EntitySheep

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntitySheep

## Class signature

```java
public class EntitySheep extends EntityAnimal
```

## Constructors

- `EntitySheep(World p_i1691_1_)`

## Methods

- `protected void applyEntityAttributes()`
- `EntitySheep createChild(EntityAgeable p_90011_1_)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `void eatGrassBonus()`
- `protected void entityInit()`
- `protected void func_145780_a(int p_145780_1_, int p_145780_2_, int p_145780_3_, Block p_145780_4_)`
- `float func_70890_k(float p_70890_1_)`
- `float func_70894_j(float p_70894_1_)`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `int getFleeceColor()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getLivingSound()`
- `static int getRandomFleeceColor(java.util.Random p_70895_0_)`
- `boolean getSheared()`
- `void handleHealthUpdate(byte p_70103_1_)`
- `boolean interact(EntityPlayer p_70085_1_)`
- `protected boolean isAIEnabled()`
- `void onLivingUpdate()`
- `IEntityLivingData onSpawnWithEgg(IEntityLivingData p_110161_1_)`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setFleeceColor(int p_70891_1_)`
- `void setSheared(boolean p_70893_1_)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `static float[][] fleeceColorTable`