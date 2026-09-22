import { useEffect } from 'react'
import { SITE_URL } from './data/site'

const upsertMeta = (attr, key, content) => {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const upsertCanonical = (href) => {
  if (!href) return
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const upsertJsonLd = (data) => {
  const id = 'vikingdogs-jsonld'
  const existing = document.getElementById(id)
  if (!data) {
    existing?.remove()
    return
  }
  let script = existing
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function usePageSeo({ title, description, path = '/', noindex = false, jsonLd = null }) {
  const serializedLd = jsonLd ? JSON.stringify(jsonLd) : null
  useEffect(() => {
    const url = `${SITE_URL}${path}`
    if (title) document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertCanonical(url)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertJsonLd(serializedLd ? JSON.parse(serializedLd) : null)
    return () => upsertJsonLd(null)
  }, [title, description, path, noindex, serializedLd])
}
