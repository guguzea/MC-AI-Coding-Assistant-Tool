# EntityList

**Inheritance:** java.lang.Object → net.minecraft.entity.EntityList

## Class signature

```java
public class EntityList extends java.lang.Object
```

## Constructors

- `EntityList()`

## Methods

- `static void addMapping(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int id)` — adds a mapping between Entity classes and both a string representation and an ID
- `static void addMapping(java.lang.Class<? extends Entity> entityClass, java.lang.String entityName, int entityID, int baseColor, int spotColor)` — Adds a entity mapping with egg info.
- `static Entity createEntityByID(int entityID, World worldIn)` — Create a new instance of an entity in the world by using an entity ID.
- `static Entity createEntityByName(java.lang.String entityName, World worldIn)` — Create a new instance of an entity in the world by using the entity name.
- `static Entity createEntityFromNBT(NBTTagCompound nbt, World worldIn)` — create a new instance of an entity from NBT store
- `static void func_151514_a()`
- `static java.lang.Class<? extends Entity> getClassFromID(int entityID)`
- `static int getEntityID(Entity entityIn)` — gets the entityID of a specific entity
- `static java.util.List<java.lang.String> getEntityNameList()`
- `static java.lang.String getEntityString(Entity entityIn)` — Gets the string representation of a specific entity.
- `static int getIDFromString(java.lang.String entityName)` — Returns the ID assigned to it's string representation
- `static java.lang.String getStringFromID(int entityID)` — Finds the class using IDtoClassMapping and classToStringMapping
- `static boolean isStringEntityName(Entity entityIn, java.lang.String entityName)`
- `static boolean isStringValidEntityName(java.lang.String entityName)`

## Fields

- `static java.util.Map<java.lang.Class<? extends Entity>, java.lang.String> classToStringMapping`
- `static java.util.Map<java.lang.Integer, EntityList.EntityEggInfo> entityEggs`
- `static java.util.Map<java.lang.Integer, java.lang.Class<? extends Entity>> idToClassMapping`
- `static java.util.Map<java.lang.String, java.lang.Class<? extends Entity>> stringToClassMapping`