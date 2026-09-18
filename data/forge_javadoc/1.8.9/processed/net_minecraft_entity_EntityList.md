# EntityList

## Class signature

```java
public class EntityList extends java.lang.Object
```

## Constructors

- `public EntityList()`

## Methods

- `public static void addMapping(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int id)`
- `public static void addMapping(java.lang.Class<? extends Entity > entityClass, java.lang.String entityName, int entityID, int baseColor, int spotColor)`
- `public static Entity createEntityByName(java.lang.String entityName, World worldIn)`
- `public static Entity createEntityFromNBT( NBTTagCompound nbt, World worldIn)`
- `public static Entity createEntityByID(int entityID, World worldIn)`
- `public static int getEntityID( Entity entityIn)`
- `public static java.lang.Class<? extends Entity > getClassFromID(int entityID)`
- `public static java.lang.String getEntityString( Entity entityIn)`
- `public static java.lang.String getStringFromID(int entityID)`
- `public static int getIDFromString(java.lang.String entityName)`
- `public static void func_151514_a()`
- `public static java.util.List<java.lang.String> getEntityNameList()`
- `public static boolean isStringEntityName( Entity entityIn, java.lang.String entityName)`
- `public static boolean isStringValidEntityName(java.lang.String entityName)`

## Description

adds a mapping between Entity classes and both a string representation and an ID