# EntitySpellcasterIllager

## Class signature

```java
public abstract class EntitySpellcasterIllager extends AbstractIllager
```

## Constructors

- `public EntitySpellcasterIllager( World p_i47506_1_)`

## Methods

- `protected void entityInit()`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public AbstractIllager.IllagerArmPose getArmPose()`
- `public boolean isSpellcasting()`
- `public void setSpellType( EntitySpellcasterIllager.SpellType spellType)`
- `protected EntitySpellcasterIllager.SpellType getSpellType()`
- `protected void updateAITasks()`
- `public void onUpdate()`
- `protected int getSpellTicks()`
- `protected abstract SoundEvent getSpellSound()`