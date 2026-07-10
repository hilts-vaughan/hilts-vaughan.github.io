document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bluesky-comments");
  if (!container) return;

  const bskyWebUrl = container.getAttribute("data-bsky-uri");
  const bskyAuthor = container.getAttribute("data-bsky-author");
  const pageTitle = container.getAttribute("data-page-title") || document.title;
  const pagePath = container.getAttribute("data-page-path") || "";
  const pageUrl = container.getAttribute("data-page-url") || window.location.href;

  // Set up stale-while-revalidate loading
  loadBlueskyComments({ webUrl: bskyWebUrl, author: bskyAuthor, pageTitle, pagePath, pageUrl }, container);
});

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache expiration

async function loadBlueskyComments(context, container) {
  let webUrl = context.webUrl || null;
  const composeUrl = buildBlueskyComposeUrl(context);

  try {
    webUrl = webUrl || await discoverBlueskyPostUri(context);
    if (!webUrl) {
      if (composeUrl) {
        updateReplyButton(composeUrl, "Start thread on Bluesky");
        renderSeedPrompt(container, composeUrl, context);
        return;
      }
      throw new Error("No matching Bluesky post URI could be resolved.");
    }
    updateReplyButton(webUrl);

    const parsed = parseBlueskyUrl(webUrl);
    if (!parsed) {
      throw new Error("Invalid Bluesky URL format. Expected a post URL.");
    }
    
    const { handle, postId } = parsed;
    const did = await resolveHandleToDid(handle);
    const atUri = `at://${did}/app.bsky.feed.post/${postId}`;
    
    const cacheKey = `bsky_thread_${postId}`;
    const cachedDataStr = localStorage.getItem(cacheKey);
    let cachedData = null;
    
    if (cachedDataStr) {
      try {
        cachedData = JSON.parse(cachedDataStr);
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    // Stale-While-Revalidate caching strategy
    if (cachedData && cachedData.thread) {
      // 1. Render immediately from cache
      renderComments(cachedData.thread, container, webUrl);
      
      // 2. Check if cache is stale and revalidate in background
      const now = Date.now();
      if (now - cachedData.timestamp > CACHE_TTL) {
        revalidateThreadInBackground(atUri, cacheKey, container, webUrl);
      }
    } else {
      // 3. No cache available, fetch synchronously
      const thread = await fetchPostThread(atUri);
      saveToCache(cacheKey, thread);
      renderComments(thread, container, webUrl);
    }
  } catch (error) {
    console.error("Bluesky comments error:", error);
    const fallbackUrl = composeUrl || webUrl;
    if (fallbackUrl) {
      updateReplyButton(fallbackUrl, composeUrl ? "Start thread on Bluesky" : "Reply on Bluesky");
      renderSeedPrompt(container, fallbackUrl, context);
      return;
    }
    container.innerHTML = `
      <div class="bsky-error">
        <p>Failed to load comments from Bluesky.</p>
        <p><a href="${webUrl}" target="_blank" rel="noopener noreferrer" class="bsky-fallback-link">Click here to view the discussion thread on Bluesky directly.</a></p>
      </div>
    `;
  }
}

function updateReplyButton(webUrl, label) {
  const button = document.getElementById("bsky-cta-button");
  if (!button) return;
  button.href = webUrl;
  if (label) {
    button.textContent = label;
  }
  button.hidden = false;
}

function buildBlueskyComposeUrl(context) {
  if (!context) return null;

  const pageTitle = context.pageTitle || document.title || "";
  const pageUrl = context.pageUrl || window.location.href || "";
  const authorHandle = context.author || "";

  const pieces = [];
  if (authorHandle) {
    pieces.push(`@${authorHandle}`);
  }
  if (pageTitle) {
    pieces.push(`I wanted to leave a comment on "${pageTitle}".`);
  } else {
    pieces.push("I wanted to leave a comment on this post.");
  }
  if (pageUrl) {
    pieces.push(pageUrl);
  }

  const text = pieces.join(" ");
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
}

function renderSeedPrompt(container, composeUrl, context) {
  const pageTitle = escapeHTML(context && context.pageTitle ? context.pageTitle : "this post");
  const authorHandle = escapeHTML(context && context.author ? context.author : "the author");

  container.innerHTML = `
    <div class="bsky-error">
      <p>No Bluesky thread exists for ${pageTitle} yet.</p>
      <p><a href="${composeUrl}" target="_blank" rel="noopener noreferrer" class="bsky-fallback-link">Seed a new Bluesky post to ${authorHandle} with the page link.</a></p>
    </div>
  `;
}

async function revalidateThreadInBackground(atUri, cacheKey, container, webUrl) {
  try {
    const thread = await fetchPostThread(atUri);
    saveToCache(cacheKey, thread);
    renderComments(thread, container, webUrl);
  } catch (e) {
    console.warn("Background revalidation of comments failed. Using stale cache. Error:", e);
  }
}

async function discoverBlueskyPostUri(context) {
  if (!context.author) return null;

  const did = await resolveHandleToDid(context.author);
  const pageSignals = buildPageSignals(context.pageTitle, context.pageUrl);
  if (context.pagePath) {
    pageSignals.relativeUrl = normalizeUrl(context.pagePath);
  }
  let cursor = null;
  let bestMatch = null;

  for (let page = 0; page < 4; page += 1) {
    const feedPage = await fetchAuthorFeed(did, cursor);
    const items = Array.isArray(feedPage.feed) ? feedPage.feed : [];

    for (const item of items) {
      const candidate = scoreCandidate(item && item.post, pageSignals);
      if (!candidate) continue;
      if (!bestMatch || candidate.score > bestMatch.score) {
        bestMatch = candidate;
      }
    }

    if (bestMatch && bestMatch.score >= 1000) break;
    cursor = feedPage.cursor || null;
    if (!cursor) break;
  }

  return bestMatch ? postUriFromRecord(bestMatch.post) : null;
}

async function fetchAuthorFeed(actorDid, cursor) {
  const params = new URLSearchParams({
    actor: actorDid,
    limit: "100"
  });
  if (cursor) params.set("cursor", cursor);

  const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?${params.toString()}`;
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch author feed. HTTP status: ${res.status}`);
  }

  return await res.json();
}

function buildPageSignals(pageTitle, pageUrl) {
  const normalizedTitle = normalizeSearchText(pageTitle);
  const normalizedUrl = normalizeUrl(pageUrl);
  const titleTokens = normalizedTitle.split(" ").filter(token => token.length > 2);
  const urlTokens = normalizedUrl.split(" ").filter(token => token.length > 2);

  return {
    normalizedTitle,
    normalizedUrl,
    relativeUrl: normalizedUrl,
    titleTokens,
    urlTokens
  };
}

function scoreCandidate(post, pageSignals) {
  if (!post || !post.record) return null;

  const postText = normalizeSearchText(post.record.text || "");
  const postLinks = extractPostLinks(post);
  let score = 0;

  for (const link of postLinks) {
    const normalizedLink = normalizeUrl(link);
    if (!normalizedLink) continue;

    const matchesUrl = [
      pageSignals.normalizedUrl,
      pageSignals.relativeUrl
    ].filter(Boolean);

    if (matchesUrl.includes(normalizedLink)) {
      score += 1000;
    } else if (matchesUrl.some(candidate => normalizedLink.includes(candidate) || candidate.includes(normalizedLink))) {
      score += 850;
    }
  }

  if (pageSignals.normalizedTitle && postText.includes(pageSignals.normalizedTitle)) {
    score += 450;
  }

  if (pageSignals.titleTokens.length > 0) {
    const matchedTitleTokens = pageSignals.titleTokens.filter(token => postText.includes(token));
    score += Math.min(300, matchedTitleTokens.length * 60);
  }

  if (pageSignals.urlTokens.length > 0) {
    const matchedUrlTokens = pageSignals.urlTokens.filter(token => postText.includes(token));
    score += Math.min(200, matchedUrlTokens.length * 40);
  }

  score += Math.min(50, (post.likeCount || 0) * 2);

  if (score <= 0) return null;

  return { post, score };
}

function extractPostLinks(post) {
  const links = new Set();
  const text = post && post.record && post.record.text ? post.record.text : "";

  text.replace(/https?:\/\/[^\s<>"')\]]+/g, (match) => {
    links.add(match);
    return match;
  });

  const facets = post && post.record && Array.isArray(post.record.facets) ? post.record.facets : [];
  for (const facet of facets) {
    const features = Array.isArray(facet.features) ? facet.features : [];
    for (const feature of features) {
      if (feature && feature.$type === "app.bsky.richtext.facet#link" && feature.uri) {
        links.add(feature.uri);
      }
    }
  }

  const external = post && post.record && post.record.embed && post.record.embed.external;
  if (external && external.uri) {
    links.add(external.uri);
  }

  return Array.from(links);
}

function postUriFromRecord(post) {
  if (!post || !post.uri || !post.author || !post.author.handle) return null;
  const uriParts = post.uri.split("/");
  const postKey = uriParts[uriParts.length - 1];
  return `https://bsky.app/profile/${post.author.handle}/post/${postKey}`;
}

function saveToCache(key, thread) {
  try {
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      thread: thread
    }));
  } catch (e) {
    console.warn("Failed to write comments to localStorage:", e);
  }
}

function normalizeSearchText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeUrl(url) {
  return String(url || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[#?].*$/, "")
    .replace(/\/index\.html$/, "/")
    .replace(/\/+$/, "");
}

function parseBlueskyUrl(webUrl) {
  try {
    const url = new URL(webUrl);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    // Path format is profile/<handle>/post/<postId>
    if (
      pathSegments.length >= 4 &&
      pathSegments[0] === "profile" &&
      pathSegments[2] === "post"
    ) {
      return {
        handle: pathSegments[1],
        postId: pathSegments[3]
      };
    }
  } catch (e) {
    // Ignore URL parsing errors
  }
  return null;
}

async function resolveHandleToDid(handle) {
  if (handle.startsWith("did:")) return handle;
  
  const cacheKey = `bsky_did_${handle}`;
  const cachedDid = localStorage.getItem(cacheKey);
  if (cachedDid) return cachedDid;

  const resolveUrl = `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;
  const res = await fetch(resolveUrl);
  if (!res.ok) {
    throw new Error(`Failed to resolve handle ${handle}`);
  }
  const data = await res.json();
  if (!data.did) {
    throw new Error(`DID not returned for handle ${handle}`);
  }
  
  // Cache the resolved DID indefinitely
  try {
    localStorage.setItem(cacheKey, data.did);
  } catch (e) {
    // Ignore StorageQuota errors
  }
  return data.did;
}

async function fetchPostThread(atUri) {
  const params = new URLSearchParams({ uri: atUri });
  const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${params.toString()}`;
  
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch comments. HTTP status: ${res.status}`);
  }
  
  const data = await res.json();
  if (!data.thread) {
    throw new Error("No thread found in the response");
  }
  return data.thread;
}

function renderComments(thread, container, webUrl) {
  if (!thread || thread.$type !== "app.bsky.feed.defs#threadViewPost") {
    container.innerHTML = '<div class="bsky-no-comments">This post could not be found or loaded.</div>';
    return;
  }

  const post = thread.post;
  const likeCount = post.likeCount || 0;
  const repostCount = post.repostCount || 0;
  const replyCount = post.replyCount || 0;
  
  let replies = thread.replies || [];
  const validReplies = replies
    .filter(r => r.$type === "app.bsky.feed.defs#threadViewPost" && r.post && r.post.author)
    .sort((a, b) => (b.post.likeCount || 0) - (a.post.likeCount || 0));

  let repliesHtml = "";
  if (validReplies.length > 0) {
    repliesHtml = validReplies.map(r => buildCommentTreeHtml(r)).join("");
  } else {
    repliesHtml = '<div class="bsky-no-comments">No comments yet on this post. Be the first to share your thoughts by clicking reply!</div>';
  }

  container.innerHTML = `
    <div class="bsky-thread-summary">
      <a href="${webUrl}" target="_blank" rel="noopener noreferrer" class="bsky-summary-stats">
        <span class="bsky-stat"><span class="bsky-heart-icon">♥</span> ${likeCount} likes</span>
        <span class="bsky-stat-separator">•</span>
        <span class="bsky-stat"><span class="bsky-repost-icon">⇆</span> ${repostCount} reposts</span>
        <span class="bsky-stat-separator">•</span>
        <span class="bsky-stat"><span class="bsky-bubble-icon">💬</span> ${replyCount} replies</span>
      </a>
    </div>
    
    <div class="bsky-comments-list">
      ${repliesHtml}
    </div>
  `;
}

function buildCommentTreeHtml(commentNode) {
  if (!commentNode || commentNode.$type !== "app.bsky.feed.defs#threadViewPost") return "";
  
  const post = commentNode.post;
  const author = post.author;
  const authorName = escapeHTML(author.displayName || author.handle);
  const authorHandle = escapeHTML(author.handle);
  const avatarUrl = author.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
  const postText = post.record && post.record.text ? linkify(post.record.text) : "";
  const createdDate = post.record && post.record.createdAt ? new Date(post.record.createdAt) : null;
  const timeStr = createdDate ? formatDate(createdDate) : "";
  
  const likeCount = post.likeCount || 0;
  const repostCount = post.repostCount || 0;
  
  const uriParts = post.uri.split("/");
  const postKey = uriParts[uriParts.length - 1];
  const postUrl = `https://bsky.app/profile/${authorHandle}/post/${postKey}`;

  let repliesHtml = "";
  if (commentNode.replies && commentNode.replies.length > 0) {
    const sortedReplies = commentNode.replies
      .filter(r => r.$type === "app.bsky.feed.defs#threadViewPost" && r.post && r.post.author)
      .sort((a, b) => (b.post.likeCount || 0) - (a.post.likeCount || 0));
      
    if (sortedReplies.length > 0) {
      repliesHtml = `
        <div class="bsky-replies-list">
          ${sortedReplies.map(r => buildCommentTreeHtml(r)).join("")}
        </div>
      `;
    }
  }

  return `
    <div class="bsky-comment-node">
      <div class="bsky-comment">
        <a href="https://bsky.app/profile/${authorHandle}" target="_blank" rel="noopener noreferrer" class="bsky-comment-avatar-link">
          <img src="${avatarUrl}" alt="${authorName}" class="bsky-comment-avatar" loading="lazy">
        </a>
        <div class="bsky-comment-content">
          <div class="bsky-comment-meta">
            <a href="https://bsky.app/profile/${authorHandle}" target="_blank" rel="noopener noreferrer" class="bsky-author-name">
              ${authorName}
            </a>
            <span class="bsky-author-handle">@${authorHandle}</span>
            <span class="bsky-comment-date" title="${createdDate ? createdDate.toLocaleString() : ''}">${timeStr}</span>
          </div>
          <div class="bsky-comment-body">
            <p>${postText}</p>
          </div>
          <div class="bsky-comment-actions">
            <span class="bsky-action-stat" title="Likes">
              <span class="bsky-action-icon">♥</span>
              <span class="bsky-action-count">${likeCount}</span>
            </span>
            <span class="bsky-action-stat" title="Reposts">
              <span class="bsky-action-icon">⇆</span>
              <span class="bsky-action-count">${repostCount}</span>
            </span>
            <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="bsky-reply-button">
              Reply
            </a>
          </div>
        </div>
      </div>
      ${repliesHtml}
    </div>
  `;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
    }
  });
}

function linkify(text) {
  let escaped = escapeHTML(text);
  
  // Replace URLs with clickable links
  escaped = escaped.replace(/https?:\/\/[^\s$.?#].[^\s]*/g, (url) => {
    // Avoid double escaping in target link
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="bsky-intext-link">${url}</a>`;
  });
  
  // Replace @handles with profile links
  escaped = escaped.replace(/@([a-zA-Z0-9\-.]+)/g, (match, handle) => {
    return `<a href="https://bsky.app/profile/${handle}" target="_blank" rel="noopener noreferrer" class="bsky-intext-link">@${handle}</a>`;
  });
  
  // Convert newlines to line breaks
  return escaped.replace(/\n/g, '<br>');
}

function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
