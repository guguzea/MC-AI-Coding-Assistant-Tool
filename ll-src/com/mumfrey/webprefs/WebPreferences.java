package com.mumfrey.webprefs;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.webprefs.exceptions.InvalidKeyException;
import com.mumfrey.webprefs.exceptions.InvalidValueException;
import com.mumfrey.webprefs.exceptions.ReadOnlyPreferencesException;
import com.mumfrey.webprefs.framework.RequestFailureReason;
import com.mumfrey.webprefs.interfaces.IWebPreferencesClient;
import com.mumfrey.webprefs.interfaces.IWebPreferencesProvider;

class WebPreferences extends AbstractWebPreferences
{
    /**
     * The update frequency to use when operating normally, this is the
     * frequency that new requests will be submitted to the remote request queue
     */
    private static final int UPDATE_FREQUENCY_TICKS = 20; // 1 second

    /**
     * Number of ticks to wait before a request is assumed to have timed out
     */
    private static final int REQUEST_TIMEOUT_TICKS = 20 * 60; // 1 minute

    /**
     * Number of ticks to wait on any communication error (request failed at the
     * server, request failed to be submitted, request timed out, etc.)
     */
    private static final int UPDATE_ERROR_SUSPEND_TICKS = 20 * 60; // 1 minute

    /**
     * Pattern for validating keys
     */
    private static final Pattern keyPattern = Pattern.compile("^[a-z0-9_\\-\\.]{1,32}$");
    
    /**
     * Preferences client, this is a delegate which is used to communicate with
     * the preferences provider
     *
     * @author Adam Mummery-Smith
     */
    class Client implements IWebPreferencesClient
    {
        @Override
        public void onGetRequestSuccess(String uuid, Map<String, String> values)
        {
            if (!WebPreferences.this.uuid.equals(uuid))
            {
                throw new RuntimeException("Received unsolicited response");
            }
            
            WebPreferences.this.onGetRequestSuccess(values);
        }

        @Override
        public void onSetRequestSuccess(String uuid, Set<String> keys)
        {
            if (!WebPreferences.this.uuid.equals(uuid))
            {
                throw new RuntimeException("Received unsolicited response");
            }
            
            WebPreferences.this.onSetRequestSuccess(keys);
        }
        
        @Override
        public void onGetRequestFailed(String uuid, Set<String> keys, RequestFailureReason reason)
        {
            if (!WebPreferences.this.uuid.equals(uuid))
            {
                throw new RuntimeException("Received unsolicited response");
            }
            
            WebPreferences.this.onGetRequestFailed(keys, reason);
        }
        
        @Override
        public void onSetRequestFailed(String uuid, Set<String> keys, RequestFailureReason reason)
        {
            if (!WebPreferences.this.uuid.equals(uuid))
            {
                throw new RuntimeException("Received unsolicited response");
            }
            
            WebPreferences.this.onSetRequestFailed(keys, reason);
        }
    }
    
    /**
     * Preferences provider
     */
    private final IWebPreferencesProvider provider;

    /**
     * Preferences delegate
     */
    private final IWebPreferencesClient client;
    
    /**
     * Current key/value pairs
     */
    protected final Map<String, String> prefs = new ConcurrentHashMap<String, String>();
    
    /**
     * Keys which have been requested by a consumer but not requested from the
     * server yet
     */
    protected final Set<String> requestedPrefs = new HashSet<String>();
    
    /**
     * Keys which have been requested from the server but not received yet
     */
    protected final Set<String> pendingPrefs = new HashSet<String>();
    
    /**
     * Keys which have been set by a consumer but not sent to the server yet
     */
    protected final Set<String> dirtyPrefs = new HashSet<String>();
    
    /**
     * Concurrency lock
     */
    protected final Object lock = new Object();
    
    /**
     * True when any kind of
     */
    protected volatile boolean dirty = false;
    
    private volatile int updateCheckTimer = 1;
    
    protected int requestTimeoutTimer = 0;
    
    WebPreferences(IWebPreferencesProvider provider, UUID uuid, boolean isPrivate, boolean isReadOnly)
    {
        this(provider, uuid.toString(), isPrivate, isReadOnly);
    }

    WebPreferences(IWebPreferencesProvider provider, String uuid, boolean isPrivate, boolean isReadOnly)
    {
        super(uuid, isPrivate, isReadOnly);
        this.provider = provider;
        this.client = new Client();
    }
    
    @Override
    void onTick()
    {
        if (this.updateCheckTimer > 0 && --this.updateCheckTimer < 1)
        {
            this.update();
        }
        
        if (this.requestTimeoutTimer > 0 && --this.requestTimeoutTimer < 1)
        {
            this.handleTimeout();
        }
    }
    
    /**
     * Handle server requests on a periodic basis
     */
    private void update()
    {
        this.updateCheckTimer = WebPreferences.UPDATE_FREQUENCY_TICKS;

        if (!this.dirty || !this.provider.isActive())
        {
            return;
        }
        
        synchronized (this.lock)
        {
            this.dirty = false;
            
            if (this.requestedPrefs.size() > 0)
            {
                LiteLoaderLogger.debug("Preferences for " + this.uuid + " is submitting a request for "
                        + this.requestedPrefs.size() + " requested preferences");
                if (this.provider.requestGet(this.client, this.uuid, new HashSet<String>(this.requestedPrefs), this.isPrivate))
                {
                    this.requestTimeoutTimer = WebPreferences.REQUEST_TIMEOUT_TICKS;
                    this.pendingPrefs.addAll(this.requestedPrefs);
                    this.requestedPrefs.clear();
                }
                else
                {
                    this.dirty = true;
                }
            }

        }
        
        this.commit(false);
    }

    /**
     * Called when a pending request is deemed to have timed out
     */
    private void handleTimeout()
    {
        this.updateCheckTimer = WebPreferences.UPDATE_ERROR_SUSPEND_TICKS;

        synchronized (this.lock)
        {
            this.requestedPrefs.addAll(this.pendingPrefs);
            this.pendingPrefs.clear();
            this.dirty = true;
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #request(java.lang.String)
     */
    @Override
    public void request(String key)
    {
        WebPreferences.validateKey(key);

        synchronized (this.lock)
        {
            this.dirty |= this.addRequestedKey(key);
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #request(java.lang.String[])
     */
    @Override
    public void request(String... keys)
    {
        if (keys.length < 1) return;
        if (keys.length == 1) this.request(keys[0]);
        
        synchronized (this.lock)
        {
            boolean dirty = false;
            
            for (String key : keys)
            {
                WebPreferences.validateKey(key);
                dirty |= this.addRequestedKey(key);
            }
            
            this.dirty |= dirty;
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #request(java.util.Set)
     */
    @Override
    public void request(Set<String> keys)
    {
        if (keys == null || keys.size() < 1) return;
        
        synchronized (this.lock)
        {
            boolean dirty = false;
            
            for (String key : keys)
            {
                WebPreferences.validateKey(key);
                dirty |= this.addRequestedKey(key);
            }
            
            this.dirty |= dirty;
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#poll()
     */
    @Override
    public void poll()
    {
        synchronized (this.lock)
        {
            this.requestedPrefs.addAll(this.prefs.keySet());
            this.requestedPrefs.removeAll(this.pendingPrefs);
            this.dirty = true;
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences#commit(boolean)
     */
    @Override
    public void commit(boolean force)
    {
        synchronized (this.lock)
        {
            // Permanent error condition
            if (this.updateCheckTimer < 0)
            {
                return;
            }
            
            if (force)
            {
                this.dirtyPrefs.addAll(this.prefs.keySet());
            }
            
            if (this.dirtyPrefs.size() > 0)
            {
                Map<String, String> outgoingPrefs = new HashMap<String, String>();
                for (String key : this.dirtyPrefs)
                {
                    outgoingPrefs.put(key, this.prefs.get(key));
                }
                
                LiteLoaderLogger.debug("Preferences for " + this.uuid + " is submitting a SET for " + outgoingPrefs.size() + " dirty preferences");
                if (this.provider.requestSet(this.client, this.uuid, outgoingPrefs, this.isPrivate))
                {
                    this.dirtyPrefs.clear();
                }
                else
                {
                    this.dirty = true;
                }
            }
        }
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #has(java.lang.String)
     */
    @Override
    public boolean has(String key)
    {
        WebPreferences.validateKey(key);

        return this.get(key) != null;
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #get(java.lang.String)
     */
    @Override
    public String get(String key)
    {
        WebPreferences.validateKey(key);

        // .get() can be outside of the synchronisation lock because we are using ConcurrentHashSet
        String value = this.prefs.get(key);
        
        if (value == null)
        {
            synchronized (this.lock)
            {
                this.dirty |= this.addRequestedKey(key);
            }
        }
        
        return value;
    }
    
    /* (non-Javadoc)
     * @see com.mumfrey.webprefs.interfaces.IWebPreferences
     *      #get(java.lang.String, java.lang.String)
     */
    @Override
    public String get(String key, String defaultValue)
    {
        WebPreferences.validateKey(key);

        String value = this.get(key);
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

        synchronized (this.lock)
        {
            String oldValue = this.prefs.get(key);
            if (value.equals(oldValue)) return;
            
            this.prefs.put(key, value);
            this.dirtyPrefs.add(key);
            this.requestedPrefs.remove(key);
            this.dirty = true;
        }
    }
    
    /**
     * Add a key to the current request set, the key will be requested from the
     * server on the next {@link #update()}
     *
     * @param key
     * @return
     */
    private boolean addRequestedKey(String key)
    {
        if (key != null && !this.pendingPrefs.contains(key))
        {
            this.requestedPrefs.add(key);
            return true;
        }
        
        return false;
    }

    /**
     * Callback from the preferences provider
     */
    void onGetRequestSuccess(Map<String, String> values)
    {
        this.requestTimeoutTimer = 0;
        
        synchronized (this.lock)
        {
            this.prefs.putAll(values);
            
            Set<String> keys = values.keySet();
            this.dirtyPrefs.removeAll(keys);
            this.pendingPrefs.removeAll(keys);
            this.requestedPrefs.removeAll(keys);
        }
    }

    /**
     * Callback from the preferences provider
     */
    void onSetRequestSuccess(Set<String> keys)
    {
        this.requestTimeoutTimer = 0;
        
        synchronized (this.lock)
        {
            this.dirtyPrefs.removeAll(keys);
            this.requestedPrefs.removeAll(keys);
            this.dirty = (this.dirtyPrefs.size() > 0 || this.requestedPrefs.size() > 0);
        }
    }

    /**
     * Callback from the preferences provider
     * @param reason
     */
    void onGetRequestFailed(Set<String> keys, RequestFailureReason reason)
    {
        this.requestTimeoutTimer = 0;
        this.handleFailedRequest(reason);

        synchronized (this.lock)
        {
            this.dirtyPrefs.addAll(keys);
            this.pendingPrefs.removeAll(keys);
            this.dirty = true;
        }
    }

    /**
     * Callback from the preferences provider
     * @param reason
     */
    void onSetRequestFailed(Set<String> keys, RequestFailureReason reason)
    {
        this.requestTimeoutTimer = 0;
        this.handleFailedRequest(reason);

        synchronized (this.lock)
        {
            this.requestedPrefs.addAll(keys);
            this.pendingPrefs.removeAll(keys);
            this.dirty = true;
        }
    }

    /**
     * @param reason
     */
    private void handleFailedRequest(RequestFailureReason reason)
    {
        if (reason.isPermanent())
        {
            LiteLoaderLogger.debug("Halting update of preferences for " + this.uuid + " permanently because " + reason);
            this.updateCheckTimer = -1;
        }
        
        int suspendUpdateFor = WebPreferences.UPDATE_ERROR_SUSPEND_TICKS * Math.max(1, reason.getSeverity());
        LiteLoaderLogger.debug("Suspending update of preferences for " + this.uuid + " for " + suspendUpdateFor + " because " + reason);
        this.updateCheckTimer = suspendUpdateFor;
    }

    /**
     * @param key
     */
    protected static void validateKey(String key)
    {
        if (key == null || !WebPreferences.keyPattern.matcher(key).matches())
        {
            throw new InvalidKeyException("The specified key [" + key + "] is not valid");
        }
    }

    /**
     * @param key
     * @param value
     */
    protected static void validateKV(String key, String value)
    {
        WebPreferences.validateKey(key);
        
        if (value == null || value.length() > 255)
        {
            throw new InvalidValueException("The specified value [" + value + "] for key [" + key + "] is not valid");
        }
    }
}
