# LoadController

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.LoadController

## Class signature

```java
public class LoadController extends java.lang.Object
```

## Constructors

- `LoadController(Loader loader)`

## Methods

- `ModContainer activeContainer()`
- `void buildModList(FMLLoadEvent event)`
- `com.google.common.collect.ImmutableBiMap<ModContainer, java.lang.Object> buildModObjectList()`
- `void distributeStateMessage(java.lang.Class<?> customEvent)`
- `void distributeStateMessage(LoaderState state, java.lang.Object... eventData)`
- `void errorOccurred(ModContainer modContainer, java.lang.Throwable exception)`
- `java.util.List<ModContainer> getActiveModList()`
- `com.google.common.collect.BiMap<ModContainer, java.lang.Object> getModObjectList()`
- `LoaderState.ModState getModState(ModContainer selectedMod)`
- `boolean isInState(LoaderState state)`
- `void printModStates(java.lang.StringBuilder ret)`
- `void propogateStateMessage(FMLEvent stateEvent)`
- `void transition(LoaderState desiredState, boolean forceState)`