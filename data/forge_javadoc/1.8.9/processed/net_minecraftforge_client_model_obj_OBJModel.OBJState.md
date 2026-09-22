# OBJModel.OBJState

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.obj.OBJModel.OBJState

## Class signature

```java
public static class OBJModel.OBJState extends java.lang.Object implements IModelState
```

## Constructors

- `OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility)`
- `OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility, IModelState parent)`

## Methods

- `<any> apply(<any> part)`
- `void changeGroupVisibilities(java.util.List<java.lang.String> names, OBJModel.OBJState.Operation operation)`
- `boolean equals(java.lang.Object obj)`
- `java.util.List<java.lang.String> getGroupNamesFromMap()`
- `java.util.List<java.lang.String> getGroupsWithVisibility(boolean visibility)`
- `IModelState getParent(IModelState parent)`
- `java.util.Map<java.lang.String, java.lang.Boolean> getVisibilityMap()`
- `int hashCode()`
- `java.lang.String toString()`

## Fields

- `protected OBJModel.OBJState.Operation operation`
- `IModelState parent`
- `protected java.util.Map<java.lang.String, java.lang.Boolean> visibilityMap`