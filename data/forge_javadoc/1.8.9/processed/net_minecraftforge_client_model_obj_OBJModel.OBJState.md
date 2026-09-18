# OBJModel.OBJState

## Constructors

- `public OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility)`
- `public OBJState(java.util.List<java.lang.String> visibleGroups, boolean visibility, IModelState parent)`

## Methods

- `public IModelState getParent( IModelState parent)`
- `public <any> apply(<any> part)`
- `public java.util.Map<java.lang.String,java.lang.Boolean> getVisibilityMap()`
- `public java.util.List<java.lang.String> getGroupsWithVisibility(boolean visibility)`
- `public java.util.List<java.lang.String> getGroupNamesFromMap()`
- `public void changeGroupVisibilities(java.util.List<java.lang.String> names, OBJModel.OBJState.Operation operation)`
- `public java.lang.String toString()`
- `public int hashCode()`
- `public boolean equals(java.lang.Object obj)`