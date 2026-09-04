# Forge → Fabric 移植指南

> 本指南帮助将 Forge 模组移植到 Fabric 平台。适用于 **Fabric 1.21.11 / Minecraft 1.21.11**。

## 核心差异概览

| 维度 | Forge | Fabric |
|------|-------|--------|
| 入口注解 | `@Mod` | `ModInitializer` 接口 + entrypoint |
| Mod 配置 | `mods.toml` | `fabric.mod.json` |
| 注册方式 | `DeferredRegister` + modEventBus | `Registry.register()` |
| 注册时机 | `RegisterEvent` 自动触发 | `onInitialize()` 方法中执行 |
| Mixin | `org.spongepowered.mixin` 插件 | **Loom 原生支持** |
| 事件系统 | `@SubscribeEvent` + Forge 事件总线 | **Fabric 事件回调** |
| Mappings | MCP（`func_XXXXX`） | Yarn（`method_XXXXX`）|
| 网络通信 | Forge 网络 API | `PayloadTypeRegistry` + `CustomPayload`（1.21.x）|
| 数据存储 | Capability API | **Attachment API**（1.21.x）|

---

## 步骤 1：项目结构迁移

### build.gradle

```groovy
// Forge → Fabric
plugins {
    // ❌ Forge
    id 'net.minecraftforge.gradle' version '[6.0.16,6.2)'
    // ✅ Fabric
    id 'fabric-loom' version '1.4-SNAPSHOT'
}

dependencies {
    // ❌ Forge
    minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
    // ✅ Fabric
    minecraft "com.mojang:minecraft:${project.minecraft_version}"
    mappings "net.fabricmc:yarn:${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:${project.loader_version}"
}
```

### mods.toml → fabric.mod.json

```json
// mods.toml (Forge)
// [[mods]]
// modId = "examplemod"
// version = "${mod_version}"
// displayName = "Example Mod"
// description = "A example mod"

// ✅ fabric.mod.json (Fabric)
{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "1.0.0",
  "name": "Example Mod",
  "description": "A example mod",
  "authors": ["YourName"],
  "entrypoints": {
    "main": ["com.example.examplemod.ExampleMod"]
  },
  "depends": {
    "fabricloader": ">=0.15.0",
    "minecraft": ">=1.21",
    "java": ">=21"
  }
}
```

---

## 步骤 2：入口类迁移

### @Mod → FabricMod

```java
// Forge
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public ExampleMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
```

```java
// ✅ Fabric
public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";

    @Override
    public void onInitialize() {
        // 所有注册在此执行
        Registry.register(Registries.ITEM, Identifier.of(MOD_ID, "my_item"),
            new Item(new Item.Settings()));
    }
}
```

---

## 步骤 3：注册系统迁移

### DeferredRegister → Registry.register

```java
// Forge
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(BlockBehaviour.Properties.of(Material.STONE)));

// ✅ Fabric
private static final Block MY_BLOCK = Registry.register(
    Registries.BLOCK,
    Identifier.of(MOD_ID, "my_block"),
    new Block(AbstractBlock.Settings.copy(Blocks.STONE))
);
```

---

## 步骤 4：事件系统迁移

### Forge 事件 → Fabric 事件

```java
// Forge
@SubscribeEvent
public void onPlayerJoin(PlayerEvent.PlayerLoggedInEvent event) {
    // 处理玩家加入
}

// ✅ Fabric
ServerPlayConnectionEvents.JOIN.register((handler, sender, server) -> {
    // 处理玩家加入
});
```

---

## 步骤 5：Mixin 迁移

```java
// Forge mixin 配置 (build.gradle)
// 官方 1.20.1 Forge MDK **没有** `id 'org.spongepowered.mixin' version '0.7.+'`。Mixin 随 Forge 提供；核不到本档插件坐标就停。
// 不要写：plugins { id 'org.spongepowered.mixin' version '0.7.+' }
mixin { add sourceSets.main, "${mod_id}.refmap.json" }

// ✅ Fabric mixin 配置（由 Loom 管理）
// 只需创建 fabric.mixins.json，无需额外插件
```

```json
// fabric.mixins.json
{
  "required": true,
  "minVersion": "0.8",
  "package": "com.example.examplemod.mixin",
  "compatibilityLevel": "JAVA_21",
  "client": ["client.MyMixin"],
  "mixins": []
}
```

---

## 步骤 6：网络通信迁移（1.21.x 重大变化）

### Forge 网络 → Fabric CustomPayload

```java
// Forge
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ModMessages {
    public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(...);
    public static int ID = 0;
    public static void register() { INSTANCE.registerMessage(ID++, MyMessage.class, ...); }
}

// ✅ Fabric 1.21.x Yarn
public record MyPayload(int data) implements CustomPayload {
    public static final CustomPayload.Id<MyPayload> ID =
        new CustomPayload.Id<>(Identifier.of(MOD_ID, "my_packet"));
    public static final PacketCodec<RegistryByteBuf, MyPayload> CODEC =
        PacketCodec.tuple(PacketCodecs.VAR_INT, MyPayload::data, MyPayload::new);

    @Override
    public Id<? extends CustomPayload> getId() {
        return ID;
    }
}

PayloadTypeRegistry.playC2S().register(MyPayload.ID, MyPayload.CODEC);
PayloadTypeRegistry.playS2C().register(MyPayload.ID, MyPayload.CODEC);
```

---

## 步骤 7：Capability → Attachment（1.21.x 重大变化）

```java
// Forge
public interface MyCapability { int getValue(); void setValue(int value); }
public static final Capability<MyCapability> MY_CAP = Capability.get(...);

@SubscribeEvent
public void onAttachCapabilities(AttachCapabilitiesEvent<Entity> event) {
    if (event.getObject() instanceof PlayerEntity) {
        event.addCapability(new ResourceLocation(MOD_ID, "my_cap"), new MyProvider());
    }
}

// ✅ Fabric 1.21.x Yarn
import net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry;
import net.fabricmc.fabric.api.attachment.v1.AttachmentType;
import net.minecraft.util.Identifier;

public static final AttachmentType<Integer> CLICKS =
    AttachmentRegistry.create(Identifier.of(MOD_ID, "clicks"));

entity.setAttached(CLICKS, 1);
Integer n = entity.getAttached(CLICKS);
```

---

## 步骤 8：类名和方法名迁移

| Forge (MCP) | Fabric (Yarn) |
|-------------|--------------|
| `EntityPlayerMP` | `ServerPlayerEntity` |
| `PlayerEntity` | `PlayerEntity`（相同）|
| `sendChatMessage()` | `sendMessage(Text)` |
| `world.getBlockState(pos)` | `world.getBlockState(pos)`（相同）|
| `BlockBehaviour.Properties`（`of()` / `ofFullCopy()`） | `AbstractBlock.Settings`（`create()` / `copy()`；本档 Fabric API 已无 `FabricBlockSettings`） |
| `CreativeModeTab` | `ItemGroup` |
| `Items.DIAMOND_SWORD` | `Items.DIAMOND_SWORD`（相同）|

---

## 常见陷阱

1. **Java 版本**：Fabric 1.21.11 需要 Java 21
2. **Mixin 包名**：确保 `fabric.mixins.json` 的 `package` 与实际包名一致
3. **客户端/服务端分离**：GUI 和渲染相关必须在 `ClientModInitializer` 中处理
4. **依赖传递**：`fabric-api` 应使用 `modApi` 而非 `modImplementation`
5. **网络 API**：1.21.x 使用 `CustomPayload` + `PayloadTypeRegistry`，旧的 `ClientSidePacketRegistry` 已移除
6. **Capability API**：1.21.x 使用 `Attachment` API，旧的 Capability 已移除
