import LinkdingApi from './LinkdingApi';

class BookmarkCache {
  constructor() {
    this.cache = {
      unread: null,
      untagged: null,
      shared: null
    };
  }

  async prefetchAll() {
    // Fetch all types concurrently
    const promises = [
      // this.prefetchUnread(),
    //   this.prefetchUntagged(),
    //   this.prefetchShared()
    ];
    await Promise.all(promises);
  }

  async prefetchUnread() {
    const response = await LinkdingApi.getUnreadBookmarks({ limit: 1000, offset: 0 });
    const data = await response.json();
    this.cache.unread = data;
    return data;
  }

  async prefetchUntagged() {
    const response = await LinkdingApi.getUntaggedBookmarks({ limit: 1000, offset: 0 });
    const data = await response.json();
    this.cache.untagged = data;
    return data;
  }

  async prefetchShared() {
    const response = await LinkdingApi.getSharedBookmarks({ limit: 1000, offset: 0 });
    const data = await response.json();
    this.cache.shared = data;
    return data;
  }

  getCached(type) {
    return this.cache[type];
  }

  clearCache() {
    this.cache = {
      unread: null,
      untagged: null,
      shared: null
    };
  }

  clearUnreadCache() {
    this.cache = {
      unread: null,
    }
  }
  
}

export default new BookmarkCache();
