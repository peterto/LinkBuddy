import * as SecureStore from "expo-secure-store";
import BookmarkCache from "./BookmarkCache";

class LinkdingAPI {
  constructor() {
    this.BASE_URL = null;
    this.getToken().then((token) => {
      this.token = token;
    });
    this.updateBaseUrl();
  }

  async updateBaseUrl() {
    this.BASE_URL = await SecureStore.getItemAsync("baseURL");
    // console.log("in updateBaseUrl this.BASE_URL", this.BASE_URL);
  }

  async handleLogin(serverURL, authToken) {
    try {
      // console.log("serverURL:", serverURL);
      // Ensure the URL is properly formatted
      const formattedURL = serverURL.trim().replace(/\/+$/, "");
      // console.log("Attempting login with:", formattedURL);

      // console.log(
      //   "Full request URL:",
      //   `${formattedURL}/api/bookmarks/?limit=1`
      // );
      // console.log("Auth token:", authToken);

      const response = await fetch(`${formattedURL}/api/bookmarks/?limit=1`, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      // console.log("Full response:", response);
      // console.log("Response headers:", response.headers);
      // console.log("Login response status:", response.status);

      if (response.status === 200) {
        await SecureStore.setItemAsync("jwtToken", `Token ${authToken}`);
        await SecureStore.setItemAsync("baseURL", formattedURL);
        this.BASE_URL = formattedURL;
        await BookmarkCache.prefetchAll();
        return true;
      }
      return false;
    } catch (error) {
      // console.log("Login error:", error);
      // console.log("Detailed login error:", error.message);
      // console.log("Full error object:", error);
      return false;
    }
  }

  async handleLogout() {
    await SecureStore.deleteItemAsync("jwtToken");
    await SecureStore.deleteItemAsync("baseURL");
    await SecureStore.deleteItemAsync("isLoggedIn");
    this.BASE_URL = null;
    BookmarkCache.clearCache();
  }

  async getToken() {
    return await SecureStore.getItemAsync("jwtToken");
  }

  async getHeaders() {
    const token = await this.getToken();
    return {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
  }

  async getBookmarkDetails(params) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.BASE_URL}/api/bookmarks/${params}/`, {
      headers,
    });
    return await response.json();
  }

  async getUnreadBookmarks(params = {}) {
    const headers = await this.getHeaders();
    let url = `${this.BASE_URL}/api/bookmarks/?unread=yes`;

    if (params.limit) {
      url += `&limit=${params.limit}`;
    }
    if (params.offset) {
      url += `&offset=${params.offset}`;
    }
    if (params.query) {
      url += `&q=${encodeURIComponent(params.query)}`;
    }

    const response = await fetch(url, { headers });
    return response;
  }

  async getUntaggedBookmarks(params = {}) {
    const headers = await this.getHeaders();
    let url = `${this.BASE_URL}/api/bookmarks/?`;

    const searchQuery = params.q
      ? `!untagged+${encodeURIComponent(params.q)}`
      : "!untagged";
    url += `q=${searchQuery}`;

    // pagination
    if (params.limit) {
      url += `&limit=${params.limit}`;
    }
    if (params.offset) {
      url += `&offset=${params.offset}`;
    }

    const response = await fetch(url, { headers });
    return response;
  }

  async getSharedBookmarks(params = {}) {
    const headers = await this.getHeaders();
    let url = `${this.BASE_URL}/api/bookmarks/?shared=yes`;

    if (params.limit) {
      url += `&limit=${params.limit}`;
    }
    if (params.offset) {
      url += `&offset=${params.offset}`;
    }
    if (params.query) {
      url += `&q=${encodeURIComponent(params.query)}`;
    }

    const response = await fetch(url, { headers });
    return response;
  }

  async getBookmarks(params = {}) {
    const headers = await this.getHeaders();

    let url = `${this.BASE_URL}/api/bookmarks/?limit=${params.limit}&offset=${params.offset}`;

    // Add search query if it exists
    if (params.query) {
      url += `&q=${encodeURIComponent(params.query)}`;
    }
    const response = await fetch(url, {
      headers,
    });

    return response;
  }

  async checkWebsiteMetadata(url) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.BASE_URL}/api/bookmarks/check/?url=${encodeURIComponent(url)}`,
      {
        headers,
      }
    );
    return response.json();
  }

  async createBookmark(bookmarkData) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.BASE_URL}/api/bookmarks/`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookmarkData),
    });
    return response;
  }

  async updateBookmark(bookmarkId, bookmarkData) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.BASE_URL}/api/bookmarks/${bookmarkId}/`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(bookmarkData),
      }
    );
    // BookmarkCache.clearCache();
    return response;
  }

  async deleteBookmark(bookmarkId) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.BASE_URL}/api/bookmarks/${bookmarkId}/`,
      {
        method: "DELETE",
        headers,
      }
    );
    return response.status === 204;
  }

  // Get archived bookmarks
  async getArchivedBookmarks(params = {}) {
    const headers = await this.getHeaders();
    params.is_archived = true;
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${this.BASE_URL}/api/bookmarks/archived/?${queryString}`,
      {
        headers,
      }
    );
    return response;
  }

  // Archive a bookmark
  async archiveBookmark(bookmarkId) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.BASE_URL}/api/bookmarks/${bookmarkId}/`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ is_archived: true }),
      }
    );
    return response.json();
  }

  // Unarchive a bookmark
  async unarchiveBookmark(bookmarkId) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.BASE_URL}/api/bookmarks/${bookmarkId}/`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ is_archived: false }),
      }
    );
    return response.json();
  }

  // Tags endpoints
  async getTags() {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.BASE_URL}/api/tags/?limit=2000`, {
      headers,
    });
    return response.json();
  }

  async getTagsWithParams(params = {}) {
    const headers = await this.getHeaders();
    let url = `${this.BASE_URL}/api/tags/?limit=${params.limit}&offset=${params.offset}`;

    const response = await fetch(url, {
      headers,
    });

    return response;
  }

  // Create a new tag
  async createTag(tagName) {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.BASE_URL}/api/tags/`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: tagName }),
    });
    return response.json();
  }

  async searchTags(query) {
    const headers = await this.getHeaders();
    const response = await fetch(
      `${this.BASE_URL}/api/tags/?q=${encodeURIComponent(query)}&limit=5`,
      {
        headers,
      }
    );
    return response.json();
  }

  async getBookmarksByTag(params = {}) {
    const headers = await this.getHeaders();

    let url = `${this.BASE_URL}/api/bookmarks/?`;

    // Add search query if it exists
    if (params.q) {
      // url += `q=limit=${params.limit}&offset=${params.offset}&q=${encodeURIComponent(params.q)}`;
      url += `q=${encodeURIComponent("#" + params.q)}`;
    }
    const response = await fetch(url, {
      headers,
    });
    const data = await response.json();

    return data;
  }

  // Get user profile details
  async getUserProfile() {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.BASE_URL}/api/user/profile/`, {
      method: "GET",
      headers,
    });

    return response.json();
  }
}

export default new LinkdingAPI();
