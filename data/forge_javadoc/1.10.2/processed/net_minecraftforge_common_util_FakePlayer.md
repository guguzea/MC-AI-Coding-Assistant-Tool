# FakePlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP → net.minecraftforge.common.util.FakePlayer

## Class signature

```java
public class FakePlayer extends EntityPlayerMP
```

## Methods

- `void addChatComponentMessage(ITextComponent chatmessagecomponent)`
- `void addStat(StatBase par1StatBase, int par2)`
- `boolean canAttackPlayer(EntityPlayer player)`
- `boolean canCommandSenderUseCommand(int i, java.lang.String s)`
- `Entity changeDimension(int dim)`
- `Vec3d getPositionVector()`
- `void handleClientSettings(CPacketClientSettings pkt)`
- `boolean isEntityInvulnerable(DamageSource source)`
- `void onDeath(DamageSource source)`
- `void onUpdate()`
- `void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)` — Opens a GUI with this player, uses FML's IGuiHandler system.

## Fields

- `FakePlayer`