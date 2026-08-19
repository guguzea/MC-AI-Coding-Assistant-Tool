---
description: 10 — GUI / Container 开发
---

# 10 — GUI / Container 开发

> 适用版本：Forge 1.13.2（javadoc 1.13.2-25.0.220）

---

## 约束

本档 **没有** `ContainerType` / `IForgeContainerType`（javadoc 404）。**没有** `player.openContainer(modid, id, PacketBuffer)`。客户端 GUI 工厂是 **`ExtensionPoint.GUIFACTORY`**，不是 1.14 的 `ScreenManager`.

### 推荐打开路径（NetworkHooks）

服务端：`NetworkHooks.openGui(EntityPlayerMP, IInteractionObject)`（还有 `BlockPos` / `Consumer<PacketBuffer>` 重载）。`IInteractionObject#getGuiID()` 当 `ResourceLocation` 用，命名空间要能对上模组。

`IInteractionObject`：`createContainer(InventoryPlayer, EntityPlayer)` + `getGuiID()`。

客户端：`ModLoadingContext.registerExtensionPoint(ExtensionPoint.GUIFACTORY, () -> (FMLPlayMessages.OpenContainer msg) -> GuiScreen)`。

### 仍存在的旧 IGuiHandler

`IGuiHandler` 仍是 `getServerGuiElement(int, EntityPlayer, World, int, int, int)` / `getClientGuiElement(...)`（loader-api 已核）。**不要**编 `createServerGui(int, PlayerInventory, PacketBuffer)`。

容器 GUI 客户端类继承 **`GuiContainer`**（`drawGuiContainerBackgroundLayer`），不要把该方法写进裸 `GuiScreen`。

名字仍是 `EntityPlayer` / `InventoryPlayer` / `Container` / `TileEntity`，不是 1.14 的 `PlayerEntity` / `PlayerInventory`。

---

## Decision Flow

```
IF 方块/TE 有槽位
  → TE 实现 IInteractionObject（或提供该接口对象）
  → 服务端 NetworkHooks.openGui((EntityPlayerMP) player, interactionObject, pos)
  → 客户端 ExtensionPoint.GUIFACTORY 返回 GuiContainer

IF 无数据的纯 UI
  → GuiScreen + 自己发包（见 06 SimpleChannel）

IF 仍走旧 IGuiHandler
  → NetworkRegistry.INSTANCE.registerGuiHandler + player.openGui（xyz int）
  → 方法签名必须是 EntityPlayer + World + x,y,z
```

---

## 示例：IInteractionObject + 打开

```java
public class MyTileEntity extends TileEntity implements IInteractionObject {
    @Override
    public Container createContainer(InventoryPlayer playerInventory, EntityPlayer player) {
        return new MyContainer(playerInventory, this);
    }

    @Override
    public String getGuiID() {
        return MOD_ID + ":my_container";
    }

    @Override
    public ITextComponent getName() {
        return new TextComponentTranslation("container.examplemod.my");
    }

    @Override
    public boolean hasCustomName() {
        return false;
    }
}
```

```java
// 服务端右键
if (!world.isRemote && player instanceof EntityPlayerMP) {
    NetworkHooks.openGui((EntityPlayerMP) player, (IInteractionObject) te, pos);
}
```

## 示例：客户端 GUIFACTORY

```java
ModLoadingContext.get().registerExtensionPoint(ExtensionPoint.GUIFACTORY, () -> msg -> {
    // 按 getGuiID / extra data 构造 GuiContainer
    return new MyGuiContainer(new MyContainer(...));
});
```

## 示例：GuiContainer

```java
public class MyGuiContainer extends GuiContainer {
    private static final ResourceLocation TEXTURES =
            new ResourceLocation(MOD_ID, "textures/gui/container/example.png");

    public MyGuiContainer(MyContainer container) {
        super(container);
        this.xSize = 176;
        this.ySize = 166;
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        this.minecraft.getTextureManager().bindTexture(TEXTURES);
        this.drawTexturedModalRect(this.guiLeft, this.guiTop, 0, 0, this.xSize, this.ySize);
    }
}
```

## 常见错误

- ❌ `IForgeContainerType` / `ContainerType` / `ScreenManager.register` — 1.14+
- ❌ `PlayerEntity` / `PlayerInventory` — 本档是 `EntityPlayer` / `InventoryPlayer`
- ❌ 在裸 `GuiScreen` 上写 `drawGuiContainerBackgroundLayer`
- ❌ 把 IGuiHandler 改成 PacketBuffer 工厂签名
