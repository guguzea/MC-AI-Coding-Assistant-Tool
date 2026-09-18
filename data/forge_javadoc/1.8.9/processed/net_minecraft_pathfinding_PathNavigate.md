# PathNavigate

## Class signature

```java
public abstract class PathNavigate extends java.lang.Object
```

## Constructors

- `public PathNavigate( EntityLiving entitylivingIn, World worldIn)`

## Methods

- `protected abstract PathFinder getPathFinder()`
- `public void setSpeed(double speedIn)`
- `public float getPathSearchRange()`
- `public final PathEntity getPathToXYZ(double x, double y, double z)`
- `public PathEntity getPathToPos( BlockPos pos)`
- `public boolean tryMoveToXYZ(double x, double y, double z, double speedIn)`
- `public void setHeightRequirement(float jumpHeight)`
- `public PathEntity getPathToEntityLiving( Entity entityIn)`
- `public boolean tryMoveToEntityLiving( Entity entityIn, double speedIn)`
- `public boolean setPath( PathEntity pathentityIn, double speedIn)`
- `public PathEntity getPath()`
- `public void onUpdateNavigation()`
- `protected void pathFollow()`
- `protected void checkForStuck( Vec3 positionVec3)`
- `public boolean noPath()`
- `public void clearPathEntity()`
- `protected abstract Vec3 getEntityPosition()`
- `protected abstract boolean canNavigate()`
- `protected boolean isInLiquid()`
- `protected void removeSunnyPath()`
- `protected abstract boolean isDirectPathBetweenPoints( Vec3 posVec31, Vec3 posVec32, int sizeX, int sizeY, int sizeZ)`

## Description

The PathEntity being followed.