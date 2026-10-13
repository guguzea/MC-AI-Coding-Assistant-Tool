/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.modconfig;

import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import com.mojang.authlib.GameProfile;
import com.mumfrey.liteloader.InitCompleteListener;
import com.mumfrey.liteloader.Tickable;
import com.mumfrey.liteloader.core.LiteLoader;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.webprefs.WebPreferencesManager;
import com.mumfrey.webprefs.exceptions.InvalidKeyException;
import com.mumfrey.webprefs.interfaces.IWebPreferences;

import net.minecraft.client.Minecraft;
import net.minecraft.entity.player.EntityPlayer;

/**
 * Convenience class for mods to work with cloud-based config. This class
 * encapsulates a typical lifecycle for working with the webprefs framework.
 * 
 * <p>To use this class, simply create a subclass with fields you wish to
 * synchronise. Fields can be {@link String}, <tt>int</tt>, <tt>float</tt> or
 * <tt>boolean</tt>, <tt>transient</tt> and <tt>static</tt> fields are ignored.
 * </p>
 * 
 * <p>Since fields are accessed via reflection, an update interval is defined in
 * order to reduce the overhead thus incurred. The default interval is 5 seconds
 * which provides a good balance between reliable replication and reduction of
 * overhead. Calling {@link #poll} temporarily reduces the update interval to 1
 * second until a response is received from the server. The interval is restored
 * to the specified update interval once a value is received, or after a minute
 * elapses with no new data from the server.</p>
 */
public abstract class CloudConfig
{
    /**
     * Minecraft TPS
     */
    public static final int TICKS_PER_SECOND = 20;

    /**
     * 5 seconds
     */
    public static final int DEFAULT_UPDATE_INTERVAL = 5 * CloudConfig.TICKS_PER_SECOND;

    /**
     * Reduced update interval to use following a call to {@link #poll} 
     */
    private static final int POLL_UPDATE_INTERVAL = 1 * CloudConfig.TICKS_PER_SECOND;
    
    /**
     * Amount of time to wait following a call to {@link #poll} before we revert
     * to normal polling interval
     */
    private static final int POLL_RESET_INTERVAL = 60 * CloudConfig.TICKS_PER_SECOND;

    /**
     * Pattern for validating keys
     */
    protected static final Pattern keyPattern = Pattern.compile("^[a-z0-9_\\-\\.]{1,32}$");

    /**
     * Same as normal key pattern except that $ gets translated to . for key
     */
    protected static final Pattern fieldKeyPattern = Pattern.compile("(?i)^[a-z0-9_\\-\\$]{1,32}$");

    /**
     * A field value tracker
     */
    abstract class TrackedField
    {
        protected final String name;
        
        private final Field handle;
        
        private boolean dirty;
        
        protected boolean initialUpdate = true;

        TrackedField(Field handle)
        {
            this.handle = handle;
            this.name = this.getName(handle);
        }

        private String getName(Field handle)
        {
            String name = handle.getName().replace("$", ".").toLowerCase();
            String prefix = CloudConfig.this.getPrefix();
            if (prefix == null)
            {
                return name;
            }
            
            String key = prefix + name;
            if (!CloudConfig.keyPattern.matcher(key).matches())
            {
                throw new InvalidKeyException("[" + key + "] is not a valid key PREFIX=" + prefix + " NAME=" + name);
            }
            return key;
        }
        
        @SuppressWarnings("unchecked")
        protected <T> T getValue() throws IllegalAccessException
        {
            return (T)this.handle.get(CloudConfig.this);
        }
        
        protected <T> void setValue(T value) throws IllegalAccessException
        {
            this.handle.set(CloudConfig.this, value);
            this.dirty = true;
        }
        
        @Override
        public final String toString()
        {
            return this.name;
        }
        
        final boolean isDirty()
        {
            boolean dirty = this.dirty;
            this.dirty = false;
            return dirty;
        }
        
        abstract void sync() throws IllegalAccessException;
    }
    
    /**
     * String field tracker
     */
    class TrackedStringField extends TrackedField
    {
        private String localValue;
        
        TrackedStringField(Field handle) throws IllegalAccessException
        {
            super(handle);
            this.localValue = this.<String>getValue();
        }

        @Override
        void sync() throws IllegalAccessException
        {
            String value = this.<String>getValue();
            if (this.initialUpdate)
            {
                this.initialUpdate = false;
            }
            else if (value != this.localValue && value != null)
            {
                if (value.length() > 255)
                {
                    LiteLoaderLogger.warning("Unable to synchronise setting [%s], length > 255 chars. The value will be truncated!", this.name);
                    value = value.substring(0, 255);
                    this.<String>setValue(value);
                    this.isDirty();
                }
                
                CloudConfig.this.preferences.set(this.name, value);
            }
            else if (CloudConfig.this.preferences.has(this.name)) 
            {
                String remoteValue = CloudConfig.this.preferences.get(this.name);
                if (value != remoteValue)
                {
                    value = remoteValue;
                    this.<String>setValue(value);
                }
            }
            
            this.localValue = value;
        }
    }
    
    /**
     * Integer field tracker
     */
    class TrackedIntegerField extends TrackedField
    {
        private int localValue;
        
        TrackedIntegerField(Field handle)
        {
            super(handle);
        }
        
        @Override
        void sync() throws IllegalAccessException
        {
            int value = this.<Integer>getValue().intValue();
            if (this.initialUpdate)
            {
                this.initialUpdate = false;
            }
            else if (value != this.localValue)
            {
                CloudConfig.this.preferences.set(this.name, String.valueOf(value));
            }
            else if (CloudConfig.this.preferences.has(this.name)) 
            {
                int remoteValue = this.tryParse(CloudConfig.this.preferences.get(this.name), value);
                if (value != remoteValue)
                {
                    value = remoteValue;
                    this.<Integer>setValue(value);
                }
            }
            
            this.localValue = value;
        }

        private int tryParse(String string, int defaultValue)
        {
            try
            {
                return Integer.parseInt(string);
            }
            catch (NumberFormatException ex)
            {
                return defaultValue;
            }
        }
    }
    
    /**
     * Float field tracker
     */
    class TrackedFloatField extends TrackedField
    {
        private float localValue;
        
        TrackedFloatField(Field handle)
        {
            super(handle);
        }
        
        @Override
        void sync() throws IllegalAccessException
        {
            float value = this.<Float>getValue().floatValue();
            if (this.initialUpdate)
            {
                this.initialUpdate = false;
            }
            else if (value != this.localValue)
            {
                CloudConfig.this.preferences.set(this.name, String.valueOf(value));
            }
            else if (CloudConfig.this.preferences.has(this.name)) 
            {
                float remoteValue = this.tryParse(CloudConfig.this.preferences.get(this.name), value);
                if (value != remoteValue)
                {
                    value = remoteValue;
                    this.<Float>setValue(value);
                }
            }
            
            this.localValue = value;
        }
        
        private float tryParse(String string, float defaultValue)
        {
            try
            {
                return Float.parseFloat(string);
            }
            catch (NumberFormatException ex)
            {
                return defaultValue;
            }
        }
    }
    
    /**
     * Bool field tracker
     */
    class TrackedBooleanField extends TrackedField
    {
        private boolean localValue;
        
        TrackedBooleanField(Field handle) throws IllegalAccessException
        {
            super(handle);
            this.localValue = this.<Boolean>getValue().booleanValue();
        }
        
        @Override
        void sync() throws IllegalAccessException
        {
            boolean value = this.<Boolean>getValue().booleanValue();
            if (this.initialUpdate)
            {
                this.initialUpdate = false;
            }
            else if (value != this.localValue)
            {
                CloudConfig.this.preferences.set(this.name, String.valueOf(value));
            }
            else if (CloudConfig.this.preferences.has(this.name)) 
            {
                boolean remoteValue = this.tryParse(CloudConfig.this.preferences.get(this.name), value);
                if (value != remoteValue)
                {
                    value = remoteValue;
                    this.<Boolean>setValue(value);
                }
            }
            
            this.localValue = value;
        }

        private boolean tryParse(String string, boolean value)
        {
            boolean isTrue = "true".equals(string);
            return (isTrue || "false".equals(string)) ? isTrue : value; 
        }
    }
    
    static final class UpdateTicker implements InitCompleteListener, Tickable
    {
        private static UpdateTicker instance;
        
        private final List<CloudConfig> prefs = new ArrayList<CloudConfig>();
        
        static UpdateTicker getInstance()
        {
            if (UpdateTicker.instance == null)
            {
                UpdateTicker.instance = new UpdateTicker();
                LiteLoader.getInterfaceManager().registerListener(UpdateTicker.instance);
            }
            
            return UpdateTicker.instance;
        }
        
        private UpdateTicker()
        {
        }
        
        void register(CloudConfig pref)
        {
            this.prefs.add(pref);
        }
        
        @Override
        public void onTick(Minecraft minecraft, float partialTicks, boolean inGame, boolean clock)
        {
            for (CloudConfig pref : this.prefs)
            {
                if (clock)
                {
                    pref.onTick();
                }
            }
        }
        
        @Override
        public void onInitCompleted(Minecraft minecraft, LiteLoader loader)
        {
            for (CloudConfig pref : this.prefs)
            {
                pref.poll();
            }
        }

        @Override
        public final String getVersion()
        {
            return "N/A";
        }

        @Override
        public final void init(File configPath)
        {
        }

        @Override
        public final void upgradeSettings(String version, File configPath, File oldConfigPath)
        {
        }

        @Override
        public final String getName()
        {
            return "UpdateTicker";
        }
    }
    
    /**
     * Web preferences manager (service in use)
     */
    protected final WebPreferencesManager manager;
    
    /**
     * Preferences instance
     */
    protected final IWebPreferences preferences;
    
    /**
     * Field trackers
     */
    private final List<TrackedField> fields = new ArrayList<TrackedField>();
    
    /**
     * Update interval specified
     */
    private final int desiredUpdateInterval;
    
    /**
     * Current update interval, reduced following a call to {@link poll} in
     * order to apply updates as soon as they arrive. 
     */
    private int updateInterval;
    
    /**
     * Ticks since thing 
     */
    private int updateCounter, pendingResetCounter;
    
    protected CloudConfig(boolean privatePrefs)
    {
        this(WebPreferencesManager.getDefault(), privatePrefs, CloudConfig.DEFAULT_UPDATE_INTERVAL);
    }
    
    protected CloudConfig(WebPreferencesManager manager, boolean privatePrefs)
    {
        this(manager, privatePrefs, CloudConfig.DEFAULT_UPDATE_INTERVAL);
    }
    
    protected CloudConfig(WebPreferencesManager manager, boolean privatePrefs, int updateInterval)
    {
        this(manager, manager.getLocalPreferences(privatePrefs), updateInterval);
    }

    protected CloudConfig(WebPreferencesManager manager, EntityPlayer player, boolean privatePrefs)
    {
        this(manager, player, privatePrefs, CloudConfig.DEFAULT_UPDATE_INTERVAL);
    }
    
    protected CloudConfig(WebPreferencesManager manager, EntityPlayer player, boolean privatePrefs, int updateInterval)
    {
        this(manager, manager.getPreferences(player, privatePrefs), updateInterval);
    }
    
    protected CloudConfig(WebPreferencesManager manager, GameProfile profile, boolean privatePrefs)
    {
        this(manager, profile, privatePrefs, CloudConfig.DEFAULT_UPDATE_INTERVAL);
    }
    
    protected CloudConfig(WebPreferencesManager manager, GameProfile profile, boolean privatePrefs, int updateInterval)
    {
        this(manager, manager.getPreferences(profile, privatePrefs), updateInterval);
    }
    
    protected CloudConfig(WebPreferencesManager manager, UUID uuid, boolean privatePrefs)
    {
        this(manager, uuid, privatePrefs, CloudConfig.DEFAULT_UPDATE_INTERVAL);
    }
    
    protected CloudConfig(WebPreferencesManager manager, UUID uuid, boolean privatePrefs, int updateInterval)
    {
        this(manager, manager.getPreferences(uuid, privatePrefs), updateInterval);
    }

    private CloudConfig(WebPreferencesManager manager, IWebPreferences preferences, int updateInterval)
    {
        this.manager = manager;
        this.preferences = preferences;
        this.updateInterval = this.desiredUpdateInterval = updateInterval;
        this.initFields();
    }
    
    /**
     * Force an update request to be sent to the server
     */
    public final void poll()
    {
        this.preferences.poll();
        this.updateInterval = Math.min(this.desiredUpdateInterval, CloudConfig.POLL_UPDATE_INTERVAL);
        this.pendingResetCounter = CloudConfig.POLL_RESET_INTERVAL;
    }
    
    /**
     * Force local changes to be pushed to the server
     */
    public final void commit()
    {
        this.preferences.commit(false);
    }

    private void initFields()
    {
        for (Field field : this.getClass().getDeclaredFields())
        {
            int modifiers = field.getModifiers();
            if (Modifier.isTransient(modifiers) || Modifier.isStatic(modifiers))
            {
                LiteLoaderLogger.debug("Skipping transient field %s in %s", field.getName(), this.getClass().getName());
                continue;
            }
            
            if (!CloudConfig.fieldKeyPattern.matcher(field.getName()).matches())
            {
                LiteLoaderLogger.warning("Skipping field with invalid name %s in %s", field.getName(), this.getClass().getName());
                continue;
            }
            
            Class<?> type = field.getType();
            try
            {
                field.setAccessible(true);
                if (type == String.class)
                {
                    this.fields.add(new TrackedStringField(field));
                    continue;
                }
                if (type == Integer.TYPE)
                {
                    this.fields.add(new TrackedIntegerField(field));
                    continue;
                }
                if (type == Float.TYPE)
                {
                    this.fields.add(new TrackedFloatField(field));
                    continue;
                }
                if (type == Boolean.TYPE)
                {
                    this.fields.add(new TrackedBooleanField(field));
                    continue;
                }
            }
            catch (IllegalAccessException ex)
            {
                LiteLoaderLogger.warning("Skipping inaccessible field %s in %s", field.getName(), this.getClass().getName());
                ex.printStackTrace();
            }
            
            LiteLoaderLogger.warning("Skipping field %s with unsupported type %s in %s", field.getName(), type, this.getClass().getName());
        }
        
        if (this.fields.size() > 0)
        {
            UpdateTicker.getInstance().register(this);
        }
    }
    
    final void onTick()
    {
        // Reset to desired interval if we don't receive an update following poll
        if (this.pendingResetCounter > 0)
        {
            this.pendingResetCounter--;
            if (this.pendingResetCounter == 0)
            {
                this.updateInterval = this.desiredUpdateInterval;
            }
        }
        
        if (++this.updateCounter > this.updateInterval)
        {
            this.updateCounter = 0;
            
            boolean dirty = false;
            for (Iterator<TrackedField> iter = this.fields.iterator(); iter.hasNext();)
            {
                TrackedField field = iter.next();
                try
                {
                    field.sync();
                    dirty |= field.isDirty();
                }
                catch (IllegalAccessException ex)
                {
                    LiteLoaderLogger.warning("Removing invalid field %s in %s", field, this.getClass().getName());
                    ex.printStackTrace();
                    iter.remove();
                }
            }
            
            if (dirty)
            {
                this.updateInterval = this.desiredUpdateInterval;
                this.pendingResetCounter = 0;
                this.onUpdated();
            }
        }
    }

    /**
     * Stub for subclasses, called when any value change is received from the
     * server 
     */
    protected void onUpdated()
    {
    }
    
    /**
     * Stub for subclasses, used to provide a prefix for all field names in this
     * class.
     * 
     * @return field prefix
     */
    protected String getPrefix()
    {
        return null;
    }
}
