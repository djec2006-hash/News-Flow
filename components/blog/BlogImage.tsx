"use client"

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export function BlogImage({ src, alt, className = "", fallbackSrc }: BlogImageProps) {
  const defaultFallback = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.src = fallbackSrc || defaultFallback
      }}
    />
  )
}



