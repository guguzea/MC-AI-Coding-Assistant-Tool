# PathNavigateClimber

## Class signature

```java
public class PathNavigateClimber extends PathNavigateGround
```

## Constructors

- `public PathNavigateClimber( EntityLiving entityLivingIn, World worldIn)`

## Methods

- `public PathEntity getPathToPos( BlockPos pos)`
- `public PathEntity getPathToEntityLiving( Entity entityIn)`
- `public boolean tryMoveToEntityLiving( Entity entityIn, double speedIn)`
- `public void onUpdateNavigation()`

## Description

Returns the path to the given EntityLiving.