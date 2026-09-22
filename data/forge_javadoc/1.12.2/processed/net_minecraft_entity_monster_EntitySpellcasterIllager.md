# EntitySpellcasterIllager

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.AbstractIllager → net.minecraft.entity.monster.EntitySpellcasterIllager

## Class signature

```java
public abstract class EntitySpellcasterIllager extends AbstractIllager
```

## Constructors

- `EntitySpellcasterIllager(World p_i47506_1_)`

## Methods

- `protected void entityInit()`
- `AbstractIllager.IllagerArmPose getArmPose()`
- `protected abstract SoundEvent getSpellSound()`
- `protected int getSpellTicks()`
- `protected EntitySpellcasterIllager.SpellType getSpellType()`
- `boolean isSpellcasting()`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setSpellType(EntitySpellcasterIllager.SpellType spellType)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected int spellTicks`