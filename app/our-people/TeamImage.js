'use client'

export default function TeamImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width="600"
      height="756"
      onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x756' }}
    />
  )
}
