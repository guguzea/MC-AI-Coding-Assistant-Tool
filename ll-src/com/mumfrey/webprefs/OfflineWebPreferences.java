package com.mumfrey.webprefs;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mumfrey.liteloader.core.LiteLoader;
import com.mumfrey.webprefs.exceptions.ReadOnlyPreferencesException;

/**
 * Surrogate preferences returned for a local offline player, allows offline
 * players to use the webpreferences system with preferences just being stored
 * locally.
 */
class OfflineWebPreferences extends DummyOfflineWebPreferences
{
    /**
     * Gson instance for serialisation/deserialisation to local JSON file
     */
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    /**
     * Maximum commit-to-disk rate in ticks
     */
    private static final int COMMIT_RATE = 20 * 3;
    
    /**
     * JSON file 
     */
    private final File store;
    
    /**
     * Local KV store
     */
    final Map<String, String> prefs;
    
    /**
     * Tick number for write throttling
     */
    private int tickNumber;
    
    /**
     * Flag indicating serialisation to disk is required
     */
    private boolean isDirty;
    
    OfflineWebPreferences(UUID uuid, boolean isPrivate, boolean isReadOnly)
    {
        this(uuid.toString(), isPrivate, isReadOnly);
    }
    
    OfflineWebPreferences(String uuid, boolean isPrivate, boolean isReadOnly)
    {
        super(uuid, isPrivate, isReadOnly);
        
        this.store = new File(LiteLoader.getCommonConfigFolder(), String.format("%s.%sprefs.json", uuid, isPrivate ? "private" : ""));
        this.prefs = this.loadValues();
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> loadValues()
    {
        if (this.store.isFile())
        {
            FileReader reader = null;
            
            try
            {
                reader = new FileReader(this.store);
                return OfflineWebPreferences.gson.fromJson(reader, Map.class);
            }
            catch (IOException ex) {}
            finally
            {
                try
                {
                    if (reader != null) reader.close();
                }
                catch (IOException ex) {}
            }
        }
        
        return new HashMap<String, String>();
    }
    
    private void saveValues()
    {
        FileWriter writer = null;

        try
        {
            writer = new FileWriter(this.store);
            OfflineWebPreferences.gson.toJson(this.prefs, writer);
        }
        catch (IOException ex) {}
        finally
        {
            try
            {
                if (writer != null) writer.close();
            }
            catch (IOException ex) {}
        }
    }
    
    @Override
    void onTick()
    {
        if (this.tickNumber++ > OfflineWebPreferences.COMMIT_RATE && this.isDirty)
        {
            this.isDirty = false;
            this.tickNumber = 0;
            this.saveValues();
        }
    }

    @Override
    public void request(String key)
    {
        WebPreferences.validateKey(key);
        if (!this.prefs.containsKey(key))
        {
            this.prefs.put(key, "");
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#commit(boolean)
     */
    @Override
    public void commit(boolean force)
    {
        this.isDirty = true;
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #has(java.lang.String)
     */
    @Override
    public boolean has(String key)
    {
        WebPreferences.validateKey(key);
        return this.prefs.containsKey(key);
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #get(java.lang.String)
     */
    @Override
    public String get(String key)
    {
        return this.get(key, "");
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #get(java.lang.String, java.lang.String)
     */
    @Override
    public String get(String key, String defaultValue)
    {
        WebPreferences.validateKey(key);
        String value = this.prefs.get(key);
        return value != null ? value : defaultValue;
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #set(java.lang.String, java.lang.String)
     */
    @Override
    public void set(String key, String value)
    {
        if (this.isReadOnly())
        {
            throw new ReadOnlyPreferencesException("Preference collection for " + this.uuid + " is read-only");
        }
        
        WebPreferences.validateKV(key, value);

        this.prefs.put(key, value);
        this.isDirty = true;
    }
}
