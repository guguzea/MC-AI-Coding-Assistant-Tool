package com.mumfrey.webprefs.interfaces;

import java.util.Set;

import com.mumfrey.webprefs.exceptions.InvalidValueException;

/**
 * Web-based preferences, objects implementing this interface represent a remote
 * asychronous Key/Value store which fetches and commits values on a best-effort
 * basis.
 *
 * <p>Values in this store are not guaranteed to be correct, nor are values
 * written to the store guaranteed to be successfully written to the store.
 *
 * <p>In general, consumers should call {@link #get} and {@link #set} with the
 * assumption that reads and writes will happen asynchronously, eg. they should
 * continually poll {@link #get} rather than caching any responses returned
 * from the preferences object.</p>
 *
 * <p>Behaviour is such that any call to {@link #has} or {@link #get} will
 * trigger asynchronous retrieval of properties from the backend server.
 * Likewise calls to {@link #set} will trigger asychronous commit of dirty
 * values (both reads and sets are batched and sent to the server as a single
 * request where possible).</p>
 *
 * <p>Keys in the collection are restricted to lowercase letters and the period
 * symbol only, failure to adhere to this format will cause any accessor methods
 * to throw InvalidKeyException. Values in the collection are strings and are
 * limited to 255 characters and must not be null, failure to adhere to these
 * restrictions will cause accessors to throw {@link InvalidValueException}.</p>
 *
 * <p>Consumers can trigger synchronisation events on the collection using
 * convenience methods, these methods do not ensure propagation of settings but
 * act can be used to alter the normal behaviour of the set when necessary, for
 * example to poll for updated values periodically. The methods request(),
 * poll() and commit() can be used to trigger synchronisation events, consult
 * the javadoc for each method for more details.</p>
 *
 * @author Adam Mummery-Smith
 */
public interface IWebPreferences
{
    /**
     * Get the UUID assoicated with this preference collection
     */
    public abstract String getUUID();
    
    /**
     * Get whether this collection is private or public
     */
    public abstract boolean isPrivate();

    /**
     * Get whether this collection is read-only. Only the player's local
     * preferences are writable. Any attempt to write to a read-only collection
     * will throw a ReadOnlyPreferencesException.
     */
    public abstract boolean isReadOnly();
    
    /**
     * Indicate to the set that the value specified by key is required an
     * should be fetched from the server in the next batch. In general,
     * consumers should use get() or has() to access the values in this
     * collection, and expect that the collection will manage fetching the
     * values from the server as part of the normal update cycle. However this
     * method has two uses:</p>
     *
     * <ul>
     *   <li>You may choose to call {@link #request} when a handle to a
     *   preferences set is obtained, to indicate to the preferences set that
     *   you will require the value in the future and it should attempt to fetch
     *   the value so that it is ready for queries against the set later.</li>
     *   <li>You may wish to indicate to the set that it should request an
     *   updated value from the server for a key which it already has (normally
     *   values are cached indefinitely).</li>
     * </ul>
     *
     * <p>In both cases, calls to request() should generally be limited to
     * periodic request for values, to avoid constantly polling the server for
     * values, and potentially running foul of request throttling at the server
     * side</p>
     *
     * @param key key to request from the server
     */
    public abstract void request(String key);

    /**
     * Works exactly as {@link IWebPreferences#request(String)} but allows
     * multiple values to be requested in a single invocation
     *
     * @param keys keys to request
     */
    public abstract void request(String... keys);

    /**
     * Works exactly as {@link IWebPreferences#request(String)} but allows
     * multiple values to be requested in a single invocation
     *
     * @param keys keys to request
     */
    public abstract void request(Set<String> keys);

    /**
     * Calling <tt>poll()</tt> is essentially the same as calling
     * {@link #request} for every key currently in the collection, this method
     * can essentially be used to refresh the entire collection and should be
     * called only in exceptional circumstances. It is called automatically by
     * the preferences manager when connecting to a server.
     *
     * <p>Invoking <tt>poll()</tt> causes all of the values in the collection to
     * be requested as a single batch</p>
     */
    public abstract void poll();

    /**
     * Similar to {@link #poll} except for property writes instead of property
     * reads. Under normal circumstances it should not be necessary to call this
     * method, since commits are handled asychronously by the update loop.
     * However it can be used to forcibly commit even "clean" values to the
     * server. This is useful if you wish to ensure that values on the server be
     * set to match the current values in the collection, regardless of
     * comodification elsewhere.
     *
     * @param force If set to false, only dirty properties are batched. If true,
     *      all properties are batched.
     */
    public abstract void commit(boolean force);
    
    /**
     * Get whether this collection has a value for the specified key, and
     * triggers asnchronous retrieval if not
     *
     * @param key Key to check for
     * @return true if collection has specified key
     */
    public abstract boolean has(String key);

    /**
     * Get the value for the specified key from this collection. Invoking this
     * method causes asynchronous retrieval of the specified key if it is not
     * found in the collection and returns null. If the key is found, then the
     * value is returned and the collection remains unchanged.
     *
     * @param key
     * @return value or null
     */
    public abstract String get(String key);
    
    /**
     * Works exactly like get(String), including triggering asynchronous
     * retrieval of the property if the property is not found in the collection,
     * except that if the property is not found the specified defaultValue is
     * returned instead of returning null.
     *
     * @param key
     * @param defaultValue
     * @return value or default
     */
    public abstract String get(String key, String defaultValue);

    /**
     * Sets a value in the collection and marks it for asynchronous commit to
     * the server.
     *
     * @param key
     * @param value
     */
    public abstract void set(String key, String value);

    /**
     * Remove a key from this collection. Marks the key to be deleted from the
     * server as well.
     *
     * @param key
     */
    public abstract void remove(String key);
}
