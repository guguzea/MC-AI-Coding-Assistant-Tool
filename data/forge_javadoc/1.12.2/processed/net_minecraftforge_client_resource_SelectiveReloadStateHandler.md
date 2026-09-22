# SelectiveReloadStateHandler

**Inheritance:** java.lang.Object → java.lang.Enum<SelectiveReloadStateHandler> → net.minecraftforge.client.resource.SelectiveReloadStateHandler

## Class signature

```java
public enum SelectiveReloadStateHandler extends java.lang.Enum<SelectiveReloadStateHandler>
```

## Methods

- `void beginReload(java.util.function.Predicate<IResourceType> resourcePredicate)` — Pushes a resource type predicate for the current reload.
- `void endReload()` — Finishes the current reload and deletes the previously added reload predicate.
- `java.util.function.Predicate<IResourceType> get()` — Gets the current reload resource predicate for the initiated reload.
- `static SelectiveReloadStateHandler valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static SelectiveReloadStateHandler [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.