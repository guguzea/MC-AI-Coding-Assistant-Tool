# PathNavigateGround

**Inheritance:** java.lang.Object → net.minecraft.pathfinding.PathNavigate → net.minecraft.pathfinding.PathNavigateGround

## Class signature

```java
public class PathNavigateGround extends PathNavigate
```

## Constructors

- `PathNavigateGround(EntityLiving entitylivingIn, World worldIn)`

## Methods

- `protected boolean canNavigate()` — If on ground or swimming and can swim
- `boolean getAvoidsWater()`
- `boolean getCanSwim()`
- `boolean getEnterDoors()`
- `protected Vec3 getEntityPosition()`
- `protected PathFinder getPathFinder()`
- `protected boolean isDirectPathBetweenPoints(Vec3 posVec31, Vec3 posVec32, int sizeX, int sizeY, int sizeZ)` — Returns true when an entity of specified size could safely walk in a straight line between the two points.
- `protected void removeSunnyPath()` — Trims path data from the end to the first sun covered block
- `void setAvoidSun(boolean par1)`
- `void setAvoidsWater(boolean avoidsWater)`
- `void setBreakDoors(boolean canBreakDoors)`
- `void setCanSwim(boolean canSwim)`
- `void setEnterDoors(boolean par1)`

## Fields

- `protected WalkNodeProcessor nodeProcessor`