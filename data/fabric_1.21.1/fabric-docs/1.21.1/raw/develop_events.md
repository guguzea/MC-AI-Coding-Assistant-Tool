# events

> 来源：https://docs.fabricmc.net/develop/events
> 版本：1.21.1
> GitHub 路径：develop/events.md
> 抓取源：vitepress
> 抓取时间：2026-07-11T14:04:48.132Z
> SHA256：cbf4152cafd4ea702a0c50175a133228d46dc811086c15550eba9cea7f2d1d6f
> 分支：main

# Events 26.1.2 ​
A guide for using events provided by the Fabric API.Fabric API provides a system that allows mods to react to actions or occurrences, also defined as events that occur in the game.

Events are hooks that satisfy common use cases and/or provide enhanced compatibility and performance between mods that hook into the same areas of the code. The use of events often substitutes the use of mixins.

Fabric API provides events for important areas in the Minecraft codebase that multiple modders may be interested in hooking into.

Events are represented by instances of net.fabricmc.fabric.api.event.Event which stores and calls callbacks. Often there is a single event instance for a callback, which is stored in a static field EVENT of the callback interface, but there are other patterns as well. For example, ClientTickEvents groups several related events together.

## Callbacks ​
Callbacks are a piece of code that is passed as an argument to an event. When the event is triggered by the game, the passed piece of code will be executed.

### Callback Interfaces ​
Each event has a corresponding callback interface. Callbacks are registered by calling register() method on an event instance, with an instance of the callback interface as the argument.

## Listening to Events ​
This example registers an AttackBlockCallback to damage the player when they hit blocks that don't drop an item when hand-mined.

javaAttackBlockCallback.EVENT.register((player, level, hand, pos, direction) -> {
	BlockState state = level.getBlockState(pos);

	// Manual spectator check is necessary because AttackBlockCallbacks fire before the spectator check
	if (!player.isSpectator() && player.getMainHandItem().isEmpty() && state.requiresCorrectToolForDrops() && level instanceof ServerLevel serverLevel) {
		player.hurtServer(serverLevel, level.damageSources().generic(), 1.0F);
	}

	return InteractionResult.PASS;
});12345678910
### Adding Items to Existing Loot Tables ​
Sometimes you may want to add items to loot tables. For example, adding your drops to a vanilla block or entity.

The simplest solution, replacing the loot table file, can break other mods. What if they want to change them as well? We'll take a look at how you can add items to loot tables without overriding the table.

We'll be adding eggs to the coal ore loot table.

#### Listening to Loot Table Loading ​
Fabric API has an event that is fired when loot tables are loaded, LootTableEvents.MODIFY. You can register a callback for it in your mod's initializer. Let's also check that the current loot table is the coal ore loot table:

javaLootTableEvents.MODIFY.register((key, tableBuilder, source, registries) -> {
	// Let's only modify built-in loot tables and leave data pack loot tables untouched by checking the source.
	// We also check that the loot table ID is equal to the ID we want.
	if (source.isBuiltin() && COAL_ORE_LOOT_TABLE_ID.equals(key)) {
		// ...
	}
});1234567
#### Adding Items to the Loot Table ​
To add an item, we'll need to add a pool with an item entry to the loot table.

We can make a pool with LootPool#lootPool, and add it to the loot table.

Our pool doesn't have any items yet, so we'll make an item entry using LootItem#lootTableItem and add it to the pool.

javaLootTableEvents.MODIFY.register((key, tableBuilder, source, registries) -> {
	// Let's only modify built-in loot tables and leave data pack loot tables untouched by checking the source.
	// We also check that the loot table ID is equal to the ID we want.
	if (source.isBuiltin() && COAL_ORE_LOOT_TABLE_ID.equals(key)) {
		// We make the pool and add an item
		LootPool.Builder poolBuilder = LootPool.lootPool().add(LootItem.lootTableItem(Items.EGG));
		tableBuilder.withPool(poolBuilder);
	}
});123456789
## Custom Events ​
Some areas of the game do not have hooks provided by the Fabric API, so you can either use a mixin or create your own event.

We'll look at creating an event that is triggered when sheep are sheared. The process of creating an event is:

- Creating the event callback interface
- Triggering the event from a mixin
- Creating a test implementation

### Creating the Event Callback Interface ​
The callback interface describes what must be implemented by event listeners that will listen to your event. The callback interface also describes how the event will be called from our mixin. It is conventional to place an Event object as a field in the callback interface, which will identify our actual event.

For our Event implementation, we will choose to use an array-backed event. The array will contain all event listeners that are listening to the event.

Our implementation will call the event listeners in order until one of them does not return InteractionResult.PASS. This means that a listener can say "cancel this", "approve this", or "don't care, pass it on to the next event listener" using its return value.

Using InteractionResult as a return value is a conventional way to make event handlers cooperate in this fashion.

You'll need to create an interface that has an Event instance and method for response implementation. A basic setup for our sheep shear callback is:

javapublic interface SheepShearCallback {
	Event<SheepShearCallback> EVENT = EventFactory.createArrayBacked(SheepShearCallback.class,
			(listeners) -> (player, sheep) -> {
				for (SheepShearCallback listener : listeners) {
					InteractionResult result = listener.interact(player, sheep);

					if (result != InteractionResult.PASS) {
						return result;
					}
				}

				return InteractionResult.PASS;
			}
	);

	InteractionResult interact(Player player, Sheep sheep);
}1234567891011121314151617Let's look at this more in-depth. When the invoker is called, we iterate over all listeners:

java(listeners) -> (player, sheep) -> {
	for (SheepShearCallback listener : listeners) {
		// ...
	}
}12345On each listener, we then call interact to get the listener's response. Here's the signature of interact that we declared in this interface:

javaInteractionResult interact(Player player, Sheep sheep);1If the listener says we have to cancel (by returning FAIL) or fully finish (SUCCESS), the callback returns the result and finishes the loop.

InteractionResult.PASS moves on to the next listener, until all listeners are called and PASS is finally returned:

java	if (result != InteractionResult.PASS) {
		return result;
	}
return InteractionResult.PASS;1234We can add Javadoc comments to the top of callback classes to document what each InteractionResult does. In our case, it might be:

java/**
 * Callback for shearing a sheep.
 * Called before the sheep is sheared, items are dropped, and items are damaged.
 * Upon return:
 * - SUCCESS cancels further processing and continues with normal shearing behavior.
 * - PASS falls back to further processing and defaults to SUCCESS if no other listeners are available
 * - FAIL cancels further processing and does not shear the sheep.
 */12345678
### Triggering the Event From a Mixin ​
We now have the basic event skeleton, but we need to trigger it. Because we want to have the event called when a player attempts to shear a sheep, we call the event invoker in Sheep#mobInteract when shear() is called (i.e. sheep can be sheared, and the player is holding shears):

java@Mixin(Sheep.class)
public class SheepMixin {
	@Inject(at = @At(value = "INVOKE", target = "Lnet/minecraft/world/entity/animal/sheep/Sheep;shear(Lnet/minecraft/server/level/ServerLevel;Lnet/minecraft/sounds/SoundSource;Lnet/minecraft/world/item/ItemStack;)V"), method = "mobInteract", cancellable = true)
	private void onShear(final Player player, final InteractionHand hand, final CallbackInfoReturnable<InteractionResult> info) {
		InteractionResult result = SheepShearCallback.EVENT.invoker().interact(player, (Sheep) (Object) this);

		if (result == InteractionResult.FAIL) {
			info.setReturnValue(result);
		}
	}
}1234567891011
### Creating a Test Implementation ​
Now we need to test our event. You can register a listener in your initialization method (or another area, if you prefer) and add custom logic there.

Here's an example that drops a diamond instead of wool at the sheep's feet:

javaSheepShearCallback.EVENT.register((player, sheep) -> {
	sheep.setSheared(true);

	// Create diamond item entity at sheep's position.
	ItemStack stack = new ItemStack(Items.DIAMOND);
	ItemEntity itemEntity = new ItemEntity(player.level(), sheep.getX(), sheep.getY(), sheep.getZ(), stack);
	player.level().addFreshEntity(itemEntity);

	return InteractionResult.FAIL;
});12345678910If you enter into your game and shear a sheep, a diamond should drop instead of wool.

Copied