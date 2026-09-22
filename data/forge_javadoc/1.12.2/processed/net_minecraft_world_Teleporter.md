# Teleporter

**Inheritance:** java.lang.Object → net.minecraft.world.Teleporter

## Class signature

```java
public class Teleporter extends java.lang.Object implements ITeleporter
```

## Constructors

- `Teleporter(WorldServer worldIn)`

## Methods

- `boolean makePortal(Entity entityIn)`
- `void placeEntity(World world, Entity entity, float yaw)` — Called to handle placing the entity in the new world.
- `boolean placeInExistingPortal(Entity entityIn, float rotationYaw)`
- `void placeInPortal(Entity entityIn, float rotationYaw)`
- `void removeStalePortalLocations(long worldTime)`

## Fields

- `protected<any> destinationCoordinateCache`
- `protected java.util.Random random`
- `protected WorldServer world`