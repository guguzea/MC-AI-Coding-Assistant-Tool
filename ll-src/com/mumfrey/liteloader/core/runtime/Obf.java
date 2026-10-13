/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.runtime;

import java.io.File;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * Centralised obfuscation table for LiteLoader
 *
 * @author Adam Mummery-Smith
 * TODO Obfuscation 1.12.2
 */
public class Obf
{
    // Non-obfuscated references, here for convenience
    // -----------------------------------------------------------------------------------------
    public static final Obf                   EventProxy = new Obf("com.mumfrey.liteloader.core.event.EventProxy"                      );
    public static final Obf                  HandlerList = new Obf("com.mumfrey.liteloader.core.event.HandlerList"                     );
    public static final Obf             BakedHandlerList = new Obf("com.mumfrey.liteloader.core.event.HandlerList$BakedHandlerList"    );
    public static final Obf    BakedProfilingHandlerList = new Obf("com.mumfrey.liteloader.core.event.ProfilingHandlerList$BakedList"  );
    public static final Obf                 PacketEvents = new Obf("com.mumfrey.liteloader.core.PacketEvents"                          );
    public static final Obf           PacketEventsClient = new Obf("com.mumfrey.liteloader.client.PacketEventsClient"                  );
    public static final Obf                  GameProfile = new Obf("com.mojang.authlib.GameProfile"                                    );
    public static final Obf                MinecraftMain = new Obf("net.minecraft.client.main.Main"                                    );
    public static final Obf              MinecraftServer = new Obf("net.minecraft.server.MinecraftServer"                              );
    public static final Obf                         GL11 = new Obf("org.lwjgl.opengl.GL11"                                             );
    public static final Obf             RealmsMainScreen = new Obf("com.mojang.realmsclient.RealmsMainScreen"                          );
    public static final Obf                  constructor = new Obf("<init>"                                                            );

    // CHECKSTYLE:OFF

    // Classes
    // -----------------------------------------------------------------------------------------
    public static final Obf                    Minecraft = new Obf("net.minecraft.client.Minecraft",                             "bib" );
    public static final Obf               EntityRenderer = new Obf("net.minecraft.client.renderer.EntityRenderer",               "buq" );
    public static final Obf                       Blocks = new Obf("net.minecraft.init.Blocks",                                  "aox" );
    public static final Obf                CrashReport$6 = new Obf("net.minecraft.crash.CrashReport$6",                          "b$6" );
    public static final Obf                  INetHandler = new Obf("net.minecraft.network.INetHandler",                          "hb"  );
    public static final Obf                        Items = new Obf("net.minecraft.init.Items",                                   "air" );
    public static final Obf                     Profiler = new Obf("net.minecraft.profiler.Profiler",                            "rl"  );
    public static final Obf                   TileEntity = new Obf("net.minecraft.tileentity.TileEntity",                        "avj" );

    // Methods
    // -----------------------------------------------------------------------------------------
    public static final Obf                    startGame = new Obf(Obf.Minecraft,                   "func_71384_a",              "aq"  );
    public static final Obf                 startSection = new Obf(Obf.Profiler,                    "func_76320_a",              "a"   );
    public static final Obf                   endSection = new Obf(Obf.Profiler,                    "func_76319_b",              "b"   );
    public static final Obf              endStartSection = new Obf(Obf.Profiler,                    "func_76318_c",              "c"   );
    public static final Obf                processPacket = new Obf(Packets.SPacketEntityVelocity,   "func_148833_a",             "a"   );

    // CHECKSTYLE:ON

    public static final int MCP = 0;
    public static final int SRG = 1;
    public static final int OBF = 2;

    private static SrgContainer srgs;

    private static final Map<String, Obf> obfs = new HashMap<String, Obf>(); 

    static
    {
        try
        {
            for (Field fd : Obf.class.getFields())
            {
                if (fd.getType().equals(Obf.class))
                {
                    Obf.obfs.put(fd.getName(), (Obf)fd.get(null));
                }
            }
        }
        catch (IllegalAccessException ex) {}
    }

    /**
     * Array of names, indexed by MCP, SRG, OBF constants
     */
    public final String[] names;

    /**
     * Class, field or method name in unobfuscated (MCP) format
     */
    public final String name;

    /**
     * Class name in bytecode notation with slashes instead of dots
     */
    public final String ref;

    /**
     * Class, field or method name in searge format
     */
    public final String srg;

    /**
     * Class, field or method name in obfuscated (original) format
     */
    public final String obf;

    /**
     * @param mcpName
     */
    protected Obf(String mcpName)
    {
        this(mcpName, mcpName, mcpName);
    }

    /**
     * @param seargeName
     * @param obfName
     */
    protected Obf(String seargeName, String obfName)
    {
        this(seargeName, obfName, null);
    }
    
    /**
     * @param seargeName
     * @param obfName
     */
    protected Obf(Obf owner, String seargeName, String obfName)
    {
        this(owner, seargeName, obfName, null);
    }

    /**
     * @param seargeName
     * @param obfName
     * @param mcpName
     */
    protected Obf(String seargeName, String obfName, String mcpName)
    {
        this(null, seargeName, obfName, mcpName);
    }
    
    private Obf(Obf owner, String seargeName, String obfName, String mcpName)
    {
        this.name = mcpName != null ? mcpName : this.getDeobfuscatedName(owner, seargeName);
        this.ref = this.name.replace('.', '/');
        this.srg = seargeName;
        this.obf = obfName;

        this.names = new String[] { this.name, this.srg, this.obf };
    }

    /**
     * @param type
     */
    public String getDescriptor(int type)
    {
        return String.format("L%s;", this.names[type].replace('.', '/'));
    }

    /**
     * Test whether any of this Obf's dimensions match the supplied name
     * 
     * @param name
     */
    public boolean matches(String name)
    {
        return this.obf.equals(name) || this.srg.equals(name)|| this.name.equals(name);
    }

    /**
     * Test whether any of this Obf's dimensions match the supplied name or
     * ordinal
     * 
     * @param name
     * @param ordinal
     */
    public boolean matches(String name, int ordinal)
    {
        if (this.isOrdinal() && ordinal > -1)
        {
            return this.getOrdinal() == ordinal;
        }

        return this.matches(name);
    }

    /**
     * Returns true if this is an ordinal pointer
     */
    public boolean isOrdinal()
    {
        return false;
    }

    /**
     * Get the ordinal for this entry
     */
    public int getOrdinal()
    {
        return -1;
    }

    @Override
    public String toString()
    {
        return String.format("%s[%s,%s,%s]@%d", this.getClass().getSimpleName(), this.name, this.srg, this.obf, this.getOrdinal());
    }

    /**
     * @param seargeName
     */
    protected String getDeobfuscatedName(Obf owner, String seargeName)
    {
        return Obf.getDeobfName(owner, seargeName);
    }

    /**
     * @param seargeName
     */
    static String getDeobfName(Obf owner, String seargeName)
    {
        if (owner == null)
        {
            return seargeName;
        }
        
        if (Obf.srgs == null)
        {
            Obf.srgs = new SrgContainer();
            String srgFileName = System.getProperty("net.minecraftforge.gradle.GradleStart.srg.srg-mcp");
            if (srgFileName != null)
            {
                try
                {
                    File srgFile = new File(srgFileName);
                    if (srgFile.isFile())
                    {
                        Obf.srgs.readSrg(srgFile);
                    }
                }
                catch (Exception ex)
                {
                    ex.printStackTrace();
                }
            }
        }
        
        SrgField field = Obf.srgs.getFieldMapping(owner.ref, seargeName, false);
        if (field != null)
        {
            return field.getName();
        }
        
        SrgMethod method = Obf.srgs.getMethodMapping(owner.ref, seargeName, false);
        if (method != null)
        {
            return method.getSimpleName();
        }

        return seargeName;
    }

    /**
     * @param name
     */
    public static Obf getByName(String name)
    {
        return Obf.obfs.get(name);
    }

    public static Obf getByName(Class<? extends Obf> obf, String name)
    {
        try
        {
            for (Field fd : obf.getFields())
            {
                if (Obf.class.isAssignableFrom(fd.getType()))
                {
                    String fieldName = fd.getName();
                    Obf entry = (Obf)fd.get(null);
                    if (name.equals(fieldName) || name.equals(entry.name))
                    {
                        return entry;
                    }
                }
            }
        }
        catch (Exception ex) {}

        return Obf.getByName(name);
    }

    public static String lookupMCPName(String obfName)
    {
        for (Obf obf : Obf.obfs.values())
        {
            if (obfName.equals(obf.obf))
            {
                return obf.name;
            }
        }

        return obfName;
    }

    /**
     * Ordinal reference, can be passed to some methods which accept an
     * {@link Obf} to indicate an offset into a class rather than a named
     * reference.
     * 
     * @author Adam Mummery-Smith
     */
    public static class Ord extends Obf
    {
        /**
         * Field/method offset 
         */
        private final int ordinal;

        /**
         * @param name Field/method name
         * @param ordinal Field/method ordinal
         */
        public Ord(String name, int ordinal)
        {
            super(name);
            this.ordinal = ordinal;
        }

        /**
         * @param ordinal Field ordinal
         */
        public Ord(int ordinal)
        {
            super("ord#" + ordinal);
            this.ordinal = ordinal;
        }

        /* (non-Javadoc)
         * @see com.mumfrey.liteloader.core.runtime.Obf#isOrdinal()
         */
        @Override
        public boolean isOrdinal()
        {
            return true;
        }

        /* (non-Javadoc)
         * @see com.mumfrey.liteloader.core.runtime.Obf#getOrdinal()
         */
        @Override
        public int getOrdinal()
        {
            return this.ordinal;
        }
    }
}
