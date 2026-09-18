# Teleporter

## Class signature

```java
public class Teleporter extends java.lang.Object
```

## Constructors

- `public Teleporter( WorldServer worldIn)`

## Methods

- `public void placeInPortal( Entity entityIn, float rotationYaw)`
- `public boolean placeInExistingPortal( Entity entityIn, float rotationYaw)`
- `public boolean makePortal( Entity p_85188_1_)`
- `public void removeStalePortalLocations(long worldTime)`

## Description

called periodically to remove out-of-date portal locations from the cache list.