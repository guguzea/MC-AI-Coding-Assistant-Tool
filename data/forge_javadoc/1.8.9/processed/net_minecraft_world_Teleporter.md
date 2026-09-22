# Teleporter

**Inheritance:** java.lang.Object → net.minecraft.world.Teleporter

## Class signature

```java
public class Teleporter extends java.lang.Object
```

## Constructors

- `Teleporter(WorldServer worldIn)`

## Methods

- `boolean makePortal(Entity p_85188_1_)`
- `boolean placeInExistingPortal(Entity entityIn, float rotationYaw)`
- `void placeInPortal(Entity entityIn, float rotationYaw)`
- `void removeStalePortalLocations(long worldTime)` — called periodically to remove out-of-date portal locations from the cache list.