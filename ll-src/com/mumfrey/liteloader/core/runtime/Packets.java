/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.runtime;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * Packet obfuscation table
 *
 * @author Adam Mummery-Smith
 * TODO Obfuscation 1.12.2
 */
public final class Packets extends Obf
{
    /**
     * Since we need to catch and deal with the fact that a packet is first
     * marshalled across threads via PacketThreadUtil, we will need to know
     * which owner object to check against the current thread in order to detect
     * when the packet instance is being processed by the main message loop. The
     * Context object describes in which context (client or server) that a
     * particular packet will be processed in on the <em>receiving</em> end, and
     * thus which object to check threading against.
     * 
     * @author Adam Mummery-Smith
     */
    public enum Context
    {
        CLIENT,
        SERVER
    }
    
    // CHECKSTYLE:OFF

    private static Map<String, Packets> packetMap = new HashMap<String, Packets>();

    public static Packets C00Handshake                            = new Packets("net/minecraft/network/handshake/client/C00Handshake",                       "md",   Context.SERVER);
    public static Packets CPacketEncryptionResponse               = new Packets("net/minecraft/network/login/client/CPacketEncryptionResponse",              "mn",   Context.SERVER);
    public static Packets CPacketLoginStart                       = new Packets("net/minecraft/network/login/client/CPacketLoginStart",                      "mm",   Context.SERVER);
    public static Packets SPacketDisconnectLogin                  = new Packets("net/minecraft/network/login/server/SPacketDisconnect",                      "mk",   Context.CLIENT);
    public static Packets SPacketEnableCompression                = new Packets("net/minecraft/network/login/server/SPacketEnableCompression",               "mj",   Context.CLIENT);
    public static Packets SPacketEncryptionRequest                = new Packets("net/minecraft/network/login/server/SPacketEncryptionRequest",               "mi",   Context.CLIENT);
    public static Packets SPacketLoginSuccess                     = new Packets("net/minecraft/network/login/server/SPacketLoginSuccess",                    "mh",   Context.CLIENT);
    public static Packets CPacketAnimation                        = new Packets("net/minecraft/network/play/client/CPacketAnimation",                        "ly",   Context.SERVER);
    public static Packets CPacketChatMessage                      = new Packets("net/minecraft/network/play/client/CPacketChatMessage",                      "la",   Context.SERVER);
    public static Packets CPacketClickWindow                      = new Packets("net/minecraft/network/play/client/CPacketClickWindow",                      "lf",   Context.SERVER);
    public static Packets CPacketClientSettings                   = new Packets("net/minecraft/network/play/client/CPacketClientSettings",                   "lc",   Context.SERVER);
    public static Packets CPacketClientStatus                     = new Packets("net/minecraft/network/play/client/CPacketClientStatus",                     "lb",   Context.SERVER);
    public static Packets CPacketCloseWindow                      = new Packets("net/minecraft/network/play/client/CPacketCloseWindow",                      "lg",   Context.SERVER);
    public static Packets CPacketConfirmTeleport                  = new Packets("net/minecraft/network/play/client/CPacketConfirmTeleport",                  "ky",   Context.SERVER);
    public static Packets CPacketConfirmTransaction               = new Packets("net/minecraft/network/play/client/CPacketConfirmTransaction",               "ld",   Context.SERVER);
    public static Packets CPacketCreativeInventoryAction          = new Packets("net/minecraft/network/play/client/CPacketCreativeInventoryAction",          "lw",   Context.SERVER);
    public static Packets CPacketCustomPayload                    = new Packets("net/minecraft/network/play/client/CPacketCustomPayload",                    "lh",   Context.SERVER);
    public static Packets CPacketEnchantItem                      = new Packets("net/minecraft/network/play/client/CPacketEnchantItem",                      "le",   Context.SERVER);
    public static Packets CPacketEntityAction                     = new Packets("net/minecraft/network/play/client/CPacketEntityAction",                     "lq",   Context.SERVER);
    public static Packets CPacketHeldItemChange                   = new Packets("net/minecraft/network/play/client/CPacketHeldItemChange",                   "lv",   Context.SERVER);
    public static Packets CPacketInput                            = new Packets("net/minecraft/network/play/client/CPacketInput",                            "lr",   Context.SERVER);
    public static Packets CPacketKeepAlive                        = new Packets("net/minecraft/network/play/client/CPacketKeepAlive",                        "lj",   Context.SERVER);
    public static Packets CPacketPlaceRecipe                      = new Packets("net/minecraft/network/play/client/CPacketPlaceRecipe",                      "ln",   Context.SERVER);
    public static Packets CPacketPlayer                           = new Packets("net/minecraft/network/play/client/CPacketPlayer",                           "lk",   Context.SERVER);
    public static Packets CPacketPlayerPosition                   = new Packets("net/minecraft/network/play/client/CPacketPlayer$Position",                  "lk$a", Context.SERVER);
    public static Packets CPacketPlayerPositionRotation           = new Packets("net/minecraft/network/play/client/CPacketPlayer$PositionRotation",          "lk$b", Context.SERVER);
    public static Packets CPacketPlayerRotation                   = new Packets("net/minecraft/network/play/client/CPacketPlayer$Rotation",                  "lk$c", Context.SERVER);
    public static Packets CPacketPlayerAbilities                  = new Packets("net/minecraft/network/play/client/CPacketPlayerAbilities",                  "lo",   Context.SERVER);
    public static Packets CPacketPlayerDigging                    = new Packets("net/minecraft/network/play/client/CPacketPlayerDigging",                    "lp",   Context.SERVER);
    public static Packets CPacketPlayerTryUseItem                 = new Packets("net/minecraft/network/play/client/CPacketPlayerTryUseItem",                 "mb",   Context.SERVER);
    public static Packets CPacketPlayerTryUseItemOnBlock          = new Packets("net/minecraft/network/play/client/CPacketPlayerTryUseItemOnBlock",          "ma",   Context.SERVER);
    public static Packets CPacketRecipeInfo                       = new Packets("net/minecraft/network/play/client/CPacketRecipeInfo",                       "ls",   Context.SERVER);
    public static Packets CPacketResourcePackStatus               = new Packets("net/minecraft/network/play/client/CPacketResourcePackStatus",               "lt",   Context.SERVER);
    public static Packets CPacketSeenAdvancements                 = new Packets("net/minecraft/network/play/client/CPacketSeenAdvancements",                 "lu",   Context.SERVER);
    public static Packets CPacketSpectate                         = new Packets("net/minecraft/network/play/client/CPacketSpectate",                         "lz",   Context.SERVER);
    public static Packets CPacketSteerBoat                        = new Packets("net/minecraft/network/play/client/CPacketSteerBoat",                        "lm",   Context.SERVER);
    public static Packets CPacketTabComplete                      = new Packets("net/minecraft/network/play/client/CPacketTabComplete",                      "kz",   Context.SERVER);
    public static Packets CPacketUpdateSign                       = new Packets("net/minecraft/network/play/client/CPacketUpdateSign",                       "lx",   Context.SERVER);
    public static Packets CPacketUseEntity                        = new Packets("net/minecraft/network/play/client/CPacketUseEntity",                        "li",   Context.SERVER);
    public static Packets CPacketVehicleMove                      = new Packets("net/minecraft/network/play/client/CPacketVehicleMove",                      "ll",   Context.SERVER);
    public static Packets SPacketAdvancementInfo                  = new Packets("net/minecraft/network/play/server/SPacketAdvancementInfo",                  "ku",   Context.CLIENT);
    public static Packets SPacketAnimation                        = new Packets("net/minecraft/network/play/server/SPacketAnimation",                        "id",   Context.CLIENT);
    public static Packets SPacketBlockAction                      = new Packets("net/minecraft/network/play/server/SPacketBlockAction",                      "ii",   Context.CLIENT);
    public static Packets SPacketBlockBreakAnim                   = new Packets("net/minecraft/network/play/server/SPacketBlockBreakAnim",                   "ig",   Context.CLIENT);
    public static Packets SPacketBlockChange                      = new Packets("net/minecraft/network/play/server/SPacketBlockChange",                      "ij",   Context.CLIENT);
    public static Packets SPacketCamera                           = new Packets("net/minecraft/network/play/server/SPacketCamera",                           "ka",   Context.CLIENT);
    public static Packets SPacketChangeGameState                  = new Packets("net/minecraft/network/play/server/SPacketChangeGameState",                  "jc",   Context.CLIENT);
    public static Packets SPacketChat                             = new Packets("net/minecraft/network/play/server/SPacketChat",                             "in",   Context.CLIENT);
    public static Packets SPacketChunkData                        = new Packets("net/minecraft/network/play/server/SPacketChunkData",                        "je",   Context.CLIENT);
    public static Packets SPacketCloseWindow                      = new Packets("net/minecraft/network/play/server/SPacketCloseWindow",                      "iq",   Context.CLIENT);
    public static Packets SPacketCollectItem                      = new Packets("net/minecraft/network/play/server/SPacketCollectItem",                      "ks",   Context.CLIENT);
    public static Packets SPacketCombatEvent                      = new Packets("net/minecraft/network/play/server/SPacketCombatEvent",                      "jo",   Context.CLIENT);
    public static Packets SPacketConfirmTransaction               = new Packets("net/minecraft/network/play/server/SPacketConfirmTransaction",               "ip",   Context.CLIENT);
    public static Packets SPacketCooldown                         = new Packets("net/minecraft/network/play/server/SPacketCooldown",                         "iv",   Context.CLIENT);
    public static Packets SPacketCustomPayload                    = new Packets("net/minecraft/network/play/server/SPacketCustomPayload",                    "iw",   Context.CLIENT);
    public static Packets SPacketCustomSound                      = new Packets("net/minecraft/network/play/server/SPacketCustomSound",                      "ix",   Context.CLIENT);
    public static Packets SPacketDestroyEntities                  = new Packets("net/minecraft/network/play/server/SPacketDestroyEntities",                  "jt",   Context.CLIENT);
    public static Packets SPacketDisconnect                       = new Packets("net/minecraft/network/play/server/SPacketDisconnect",                       "iy",   Context.CLIENT);
    public static Packets SPacketDisplayObjective                 = new Packets("net/minecraft/network/play/server/SPacketDisplayObjective",                 "kc",   Context.CLIENT);
    public static Packets SPacketEffect                           = new Packets("net/minecraft/network/play/server/SPacketEffect",                           "jf",   Context.CLIENT);
    public static Packets SPacketEntity                           = new Packets("net/minecraft/network/play/server/SPacketEntity",                           "jj",   Context.CLIENT);
    public static Packets S15PacketEntityRelMove                  = new Packets("net/minecraft/network/play/server/SPacketEntity$S15PacketEntityRelMove",    "jj$a", Context.CLIENT);
    public static Packets S16PacketEntityLook                     = new Packets("net/minecraft/network/play/server/SPacketEntity$S16PacketEntityLook",       "jj$c", Context.CLIENT);
    public static Packets S17PacketEntityLookMove                 = new Packets("net/minecraft/network/play/server/SPacketEntity$S17PacketEntityLookMove",   "jj$b", Context.CLIENT);
    public static Packets SPacketEntityAttach                     = new Packets("net/minecraft/network/play/server/SPacketEntityAttach",                     "ke",   Context.CLIENT);
    public static Packets SPacketEntityEffect                     = new Packets("net/minecraft/network/play/server/SPacketEntityEffect",                     "kw",   Context.CLIENT);
    public static Packets SPacketEntityEquipment                  = new Packets("net/minecraft/network/play/server/SPacketEntityEquipment",                  "kg",   Context.CLIENT);
    public static Packets SPacketEntityHeadLook                   = new Packets("net/minecraft/network/play/server/SPacketEntityHeadLook",                   "jx",   Context.CLIENT);
    public static Packets SPacketEntityMetadata                   = new Packets("net/minecraft/network/play/server/SPacketEntityMetadata",                   "kd",   Context.CLIENT);
    public static Packets SPacketEntityProperties                 = new Packets("net/minecraft/network/play/server/SPacketEntityProperties",                 "kv",   Context.CLIENT);
    public static Packets SPacketEntityStatus                     = new Packets("net/minecraft/network/play/server/SPacketEntityStatus",                     "iz",   Context.CLIENT);
    public static Packets SPacketEntityTeleport                   = new Packets("net/minecraft/network/play/server/SPacketEntityTeleport",                   "kt",   Context.CLIENT);
    public static Packets SPacketEntityVelocity                   = new Packets("net/minecraft/network/play/server/SPacketEntityVelocity",                   "kf",   Context.CLIENT);
    public static Packets SPacketExplosion                        = new Packets("net/minecraft/network/play/server/SPacketExplosion",                        "ja",   Context.CLIENT);
    public static Packets SPacketHeldItemChange                   = new Packets("net/minecraft/network/play/server/SPacketHeldItemChange",                   "kb",   Context.CLIENT);
    public static Packets SPacketJoinGame                         = new Packets("net/minecraft/network/play/server/SPacketJoinGame",                         "jh",   Context.CLIENT);
    public static Packets SPacketKeepAlive                        = new Packets("net/minecraft/network/play/server/SPacketKeepAlive",                        "jd",   Context.CLIENT);
    public static Packets SPacketMaps                             = new Packets("net/minecraft/network/play/server/SPacketMaps",                             "ji",   Context.CLIENT);
    public static Packets SPacketMoveVehicle                      = new Packets("net/minecraft/network/play/server/SPacketMoveVehicle",                      "jk",   Context.CLIENT);
    public static Packets SPacketMultiBlockChange                 = new Packets("net/minecraft/network/play/server/SPacketMultiBlockChange",                 "io",   Context.CLIENT);
    public static Packets SPacketOpenWindow                       = new Packets("net/minecraft/network/play/server/SPacketOpenWindow",                       "ir",   Context.CLIENT);
    public static Packets SPacketParticles                        = new Packets("net/minecraft/network/play/server/SPacketParticles",                        "jg",   Context.CLIENT);
    public static Packets SPacketPlaceGhostRecipe                 = new Packets("net/minecraft/network/play/server/SPacketPlaceGhostRecipe",                 "jm",   Context.CLIENT);
    public static Packets SPacketPlayerAbilities                  = new Packets("net/minecraft/network/play/server/SPacketPlayerAbilities",                  "jn",   Context.CLIENT);
    public static Packets SPacketPlayerListHeaderFooter           = new Packets("net/minecraft/network/play/server/SPacketPlayerListHeaderFooter",           "kr",   Context.CLIENT);
    public static Packets SPacketPlayerListItem                   = new Packets("net/minecraft/network/play/server/SPacketPlayerListItem",                   "jp",   Context.CLIENT);
    public static Packets SPacketPlayerPosLook                    = new Packets("net/minecraft/network/play/server/SPacketPlayerPosLook",                    "jq",   Context.CLIENT);
    public static Packets SPacketRecipeBook                       = new Packets("net/minecraft/network/play/server/SPacketRecipeBook",                       "js",   Context.CLIENT);
    public static Packets SPacketRemoveEntityEffect               = new Packets("net/minecraft/network/play/server/SPacketRemoveEntityEffect",               "ju",   Context.CLIENT);
    public static Packets SPacketResourcePackSend                 = new Packets("net/minecraft/network/play/server/SPacketResourcePackSend",                 "jv",   Context.CLIENT);
    public static Packets SPacketRespawn                          = new Packets("net/minecraft/network/play/server/SPacketRespawn",                          "jw",   Context.CLIENT);
    public static Packets SPacketScoreboardObjective              = new Packets("net/minecraft/network/play/server/SPacketScoreboardObjective",              "kj",   Context.CLIENT);
    public static Packets SPacketSelectAdvancementsTab            = new Packets("net/minecraft/network/play/server/SPacketSelectAdvancementsTab",            "jy",   Context.CLIENT);
    public static Packets SPacketServerDifficulty                 = new Packets("net/minecraft/network/play/server/SPacketServerDifficulty",                 "il",   Context.CLIENT);
    public static Packets SPacketSetExperience                    = new Packets("net/minecraft/network/play/server/SPacketSetExperience",                    "kh",   Context.CLIENT);
    public static Packets SPacketSetPassengers                    = new Packets("net/minecraft/network/play/server/SPacketSetPassengers",                    "kk",   Context.CLIENT);
    public static Packets SPacketSetSlot                          = new Packets("net/minecraft/network/play/server/SPacketSetSlot",                          "iu",   Context.CLIENT);
    public static Packets SPacketSignEditorOpen                   = new Packets("net/minecraft/network/play/server/SPacketSignEditorOpen",                   "jl",   Context.CLIENT);
    public static Packets SPacketSoundEffect                      = new Packets("net/minecraft/network/play/server/SPacketSoundEffect",                      "kq",   Context.CLIENT);
    public static Packets SPacketSpawnExperienceOrb               = new Packets("net/minecraft/network/play/server/SPacketSpawnExperienceOrb",               "hy",   Context.CLIENT);
    public static Packets SPacketSpawnGlobalEntity                = new Packets("net/minecraft/network/play/server/SPacketSpawnGlobalEntity",                "hz",   Context.CLIENT);
    public static Packets SPacketSpawnMob                         = new Packets("net/minecraft/network/play/server/SPacketSpawnMob",                         "ia",   Context.CLIENT);
    public static Packets SPacketSpawnObject                      = new Packets("net/minecraft/network/play/server/SPacketSpawnObject",                      "hx",   Context.CLIENT);
    public static Packets SPacketSpawnPainting                    = new Packets("net/minecraft/network/play/server/SPacketSpawnPainting",                    "ib",   Context.CLIENT);
    public static Packets SPacketSpawnPlayer                      = new Packets("net/minecraft/network/play/server/SPacketSpawnPlayer",                      "ic",   Context.CLIENT);
    public static Packets SPacketSpawnPosition                    = new Packets("net/minecraft/network/play/server/SPacketSpawnPosition",                    "kn",   Context.CLIENT);
    public static Packets SPacketStatistics                       = new Packets("net/minecraft/network/play/server/SPacketStatistics",                       "ie",   Context.CLIENT);
    public static Packets SPacketTabComplete                      = new Packets("net/minecraft/network/play/server/SPacketTabComplete",                      "im",   Context.CLIENT);
    public static Packets SPacketTeams                            = new Packets("net/minecraft/network/play/server/SPacketTeams",                            "kl",   Context.CLIENT);
    public static Packets SPacketTimeUpdate                       = new Packets("net/minecraft/network/play/server/SPacketTimeUpdate",                       "ko",   Context.CLIENT);
    public static Packets SPacketTitle                            = new Packets("net/minecraft/network/play/server/SPacketTitle",                            "kp",   Context.CLIENT);
    public static Packets SPacketUnloadChunk                      = new Packets("net/minecraft/network/play/server/SPacketUnloadChunk",                      "jb",   Context.CLIENT);
    public static Packets SPacketUpdateBossInfo                   = new Packets("net/minecraft/network/play/server/SPacketUpdateBossInfo",                   "ik",   Context.CLIENT);
    public static Packets SPacketUpdateHealth                     = new Packets("net/minecraft/network/play/server/SPacketUpdateHealth",                     "ki",   Context.CLIENT);
    public static Packets SPacketUpdateScore                      = new Packets("net/minecraft/network/play/server/SPacketUpdateScore",                      "km",   Context.CLIENT);
    public static Packets SPacketUpdateTileEntity                 = new Packets("net/minecraft/network/play/server/SPacketUpdateTileEntity",                 "ih",   Context.CLIENT);
    public static Packets SPacketUseBed                           = new Packets("net/minecraft/network/play/server/SPacketUseBed",                           "jr",   Context.CLIENT);
    public static Packets SPacketWindowItems                      = new Packets("net/minecraft/network/play/server/SPacketWindowItems",                      "is",   Context.CLIENT);
    public static Packets SPacketWindowProperty                   = new Packets("net/minecraft/network/play/server/SPacketWindowProperty",                   "it",   Context.CLIENT);
    public static Packets SPacketWorldBorder                      = new Packets("net/minecraft/network/play/server/SPacketWorldBorder",                      "jz",   Context.CLIENT);
    public static Packets CPacketPing                             = new Packets("net/minecraft/network/status/client/CPacketPing",                           "mv",   Context.SERVER);
    public static Packets CPacketServerQuery                      = new Packets("net/minecraft/network/status/client/CPacketServerQuery",                    "mw",   Context.SERVER);
    public static Packets SPacketPong                             = new Packets("net/minecraft/network/status/server/SPacketPong",                           "mr",   Context.CLIENT);
    public static Packets SPacketServerInfo                       = new Packets("net/minecraft/network/status/server/SPacketServerInfo",                     "ms",   Context.CLIENT);

    // CHECKSTYLE:ON

    public static final Packets[] packets = Packets.toArray();

    private static int nextPacketIndex;

    private final String shortName;

    private final int index;

    private final Context context;

    private Packets(String seargeName, String obfName, Context context)
    {
        super(seargeName.replace('/', '.'), obfName);
        
        this.shortName = Packets.getShortName(seargeName);
        this.index = Packets.nextPacketIndex++;
        Packets.packetMap.put(this.shortName, this);
        this.context = context;
    }

    private static Packets[] toArray()
    {
        Field[] fields = Packets.class.getFields();
        Packets[] packets = new Packets[Packets.nextPacketIndex];
        for (int index = 0; index < Packets.nextPacketIndex; index++)
        {
            try
            {
                packets[index] = (Packets)fields[index].get(null);
            }
            catch (Exception ex)
            {
                throw new RuntimeException(ex);
            }
        }
        return packets;
    }

    public int getIndex()
    {
        return this.index;
    }

    public String getShortName()
    {
        return this.shortName;
    }

    public Context getContext()
    {
        return this.context;
    }

    public static int indexOf(String packetClassName)
    {
        for (Packets packet : Packets.packets)
        {
            if (packet.name.equals(packetClassName) || packet.shortName.equals(packetClassName) || packet.obf.equals(packetClassName))
            {
                return packet.index;
            }
        }

        return -1;
    }

    public static int count()
    {
        return Packets.nextPacketIndex;
    }

    /**
     * @param name
     */
    public static Packets getByName(String name)
    {
        return Packets.packetMap.get(name);
    }

    private static String getShortName(String className)
    {
        String simpleName = className.substring(Math.max(className.lastIndexOf('/'), className.lastIndexOf('$')) + 1);
        String baseName = simpleName.replaceAll("^[CS]([0-9A-F]{2})?Packet", "");
        return baseName + "Packet";
    }
}
