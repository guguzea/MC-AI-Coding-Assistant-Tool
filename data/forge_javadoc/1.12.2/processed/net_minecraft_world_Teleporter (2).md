# Teleporter

## Class signature

```java
public class Teleporter extends java.lang.Object implements ITeleporter
```

## Constructors

- `public Teleporter( WorldServer worldIn)`

## Methods

- `public void placeInPortal( Entity entityIn, float rotationYaw)`
- `public boolean placeInExistingPortal( Entity entityIn, float rotationYaw)`
- `public boolean makePortal( Entity entityIn)`
- `public void removeStalePortalLocations(long worldTime)`
- `public void placeEntity( World world, Entity entity, float yaw)`

## Description

Called to handle placing the entity in the new world.