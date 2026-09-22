# DestroyBlockProgress

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.DestroyBlockProgress

## Class signature

```java
public class DestroyBlockProgress extends java.lang.Object
```

## Constructors

- `DestroyBlockProgress(int miningPlayerEntIdIn, BlockPos positionIn)`

## Methods

- `int getCreationCloudUpdateTick()` — retrieves the 'date' at which the PartiallyDestroyedBlock was created
- `int getPartialBlockDamage()`
- `BlockPos getPosition()`
- `void setCloudUpdateTick(int createdAtCloudUpdateTickIn)` — saves the current Cloud update tick into the PartiallyDestroyedBlock
- `void setPartialBlockDamage(int damage)` — inserts damage value into this partially destroyed Block. -1 causes client renderer to delete it, otherwise ranges from 1 to 10