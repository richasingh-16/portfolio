"use client"

import { useState, useRef, useEffect, useMemo, startTransition } from "react"
import { motion, useInView } from "framer-motion"

export default function ParallaxCardGrid(props: any) {
  const {
    cards = [],
    mobileColumns = 1,
    tabletColumns = 2,
    desktopColumns = 3,
    gap = 24,
    aspectRatio = 1.2,
    borderRadius = 16,
    tiltDepth = 8,
    shadowStrength = 0.15,
    enableGlare = true,
    enableRevealAnimation = true,
    enableGlassmorphism = true,
    surfaceColor = "#131825",
    backgroundColor = "transparent",
    textColor = "#FFFFFF",
    linkTextColor = "#00e57f",
    theme = "dark",
    gridDirection = "horizontal",
    titleFont,
    descriptionFont,
    tagFont,
    linkFont,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setPrefersReducedMotion(mediaQuery.matches)
      const handleChange = (e: any) => {
        startTransition(() => setPrefersReducedMotion(e.matches))
      }
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const gridColumns = useMemo(() => {
    return { mobile: mobileColumns, tablet: tabletColumns, desktop: desktopColumns }
  }, [mobileColumns, tabletColumns, desktopColumns])

  const responsiveGap = gap
  const responsiveBorderRadius = borderRadius
  const shouldAnimate = !prefersReducedMotion

  return (
    <div
      ref={containerRef}
      style={{
        ...props.style,
        position: "relative",
        width: "100%",
        maxWidth: "100%", // allows it to fill the parent container correctly
        height: "100%",
        backgroundColor,
        paddingTop: `${responsiveGap}px`,
        paddingBottom: `${responsiveGap}px`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: gridDirection === "vertical" ? "flex" : "grid",
          ...(gridDirection === "vertical"
            ? { flexDirection: "column", gap: `${responsiveGap}px` }
            : {
                gridTemplateColumns: `repeat(${gridColumns.mobile}, 1fr)`,
                gap: `${responsiveGap}px`,
                alignItems: "start",
                justifyItems: "center",
              }),
          width: "100%",
          height: "100%",
        }}
        className="card-grid"
      >
        {cards.map((card: any, index: number) => (
          <Card
            key={index}
            card={card}
            index={index}
            aspectRatio={aspectRatio}
            borderRadius={responsiveBorderRadius}
            tiltDepth={tiltDepth}
            shadowStrength={shadowStrength}
            enableGlare={enableGlare}
            enableRevealAnimation={enableRevealAnimation && shouldAnimate}
            enableGlassmorphism={enableGlassmorphism}
            surfaceColor={surfaceColor}
            textColor={textColor}
            linkTextColor={linkTextColor}
            theme={theme}
            hoverVariant={props.hoverVariant || "tilt"}
            titleFont={titleFont}
            descriptionFont={descriptionFont}
            tagFont={tagFont}
            linkFont={linkFont}
            isInView={isInView}
            shouldAnimate={shouldAnimate}
            cardWidth={card.cardWidth}
            cardHeight={card.cardHeight}
          />
        ))}
      </div>
      {gridDirection === "horizontal" && (
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 768px) {
              .card-grid {
                grid-template-columns: repeat(${gridColumns.tablet}, 1fr) !important;
              }
            }
            @media (min-width: 1024px) {
              .card-grid {
                grid-template-columns: repeat(${gridColumns.desktop}, 1fr) !important;
              }
            }
          `
        }} />
      )}
    </div>
  )
}

function Card({
  card,
  index,
  aspectRatio,
  borderRadius,
  tiltDepth,
  shadowStrength,
  enableGlare,
  enableRevealAnimation,
  enableGlassmorphism,
  surfaceColor,
  textColor,
  linkTextColor,
  theme,
  hoverVariant,
  titleFont,
  descriptionFont,
  tagFont,
  linkFont,
  isInView,
  shouldAnimate,
  cardWidth,
  cardHeight,
}: any) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const cardImage = card.image || { src: "", alt: "Default image" }

  const handleMouseMove = (e: any) => {
    if (!shouldAnimate || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    startTransition(() => {
      setMousePosition({ x, y })
    })
  }

  const handleMouseEnter = () => {
    if (shouldAnimate) {
      startTransition(() => setIsHovered(true))
    }
  }

  const handleMouseLeave = () => {
    if (shouldAnimate) {
      startTransition(() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      })
    }
  }

  const tiltX = shouldAnimate && hoverVariant === "tilt" ? mousePosition.y * tiltDepth : 0
  const tiltY = shouldAnimate && hoverVariant === "tilt" ? -mousePosition.x * tiltDepth : 0
  const glareOpacity = enableGlare && isHovered ? 0.1 : 0
  const glareX = (mousePosition.x + 1) * 50
  const glareY = (mousePosition.y + 1) * 50

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: enableRevealAnimation ? index * 0.1 : 0, ease: [0.22, 1, 0.36, 1] as any },
    },
  }

  const glassmorphismStyles = enableGlassmorphism
    ? {
        backdropFilter: "blur(20px)",
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)",
        border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      }
    : { backgroundColor: surfaceColor }

  return (
    <motion.div
      ref={cardRef}
      variants={enableRevealAnimation ? cardVariants : undefined}
      initial={enableRevealAnimation ? "hidden" : undefined}
      animate={enableRevealAnimation && (isInView || true) ? "visible" : undefined}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          width: cardWidth ? `${cardWidth}px` : "100%",
          height: cardHeight ? `${cardHeight}px` : undefined,
          aspectRatio: cardHeight ? undefined : `1 / ${aspectRatio}`,
          borderRadius: `${borderRadius}px`,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          transformStyle: "preserve-3d",
          ...glassmorphismStyles,
        }}
        animate={
          shouldAnimate
            ? {
                ...(hoverVariant === "cards-elevate-on-hover"
                  ? {
                      y: isHovered ? -8 : 0,
                      boxShadow: isHovered
                        ? `0 20px 40px rgba(0, 0, 0, ${shadowStrength * 1.8})`
                        : `0 8px 24px rgba(0, 0, 0, ${shadowStrength})`,
                    }
                  : {
                      rotateX: tiltX,
                      rotateY: tiltY,
                      boxShadow: isHovered
                        ? `0 ${20 + tiltDepth}px ${40 + tiltDepth * 2}px rgba(0, 229, 127, ${shadowStrength * 1.5})`
                        : `0 8px 24px rgba(0, 0, 0, ${shadowStrength})`,
                    }),
              }
            : {}
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => {
          if (card.linkUrl && card.linkUrl !== "#") {
            try {
              if (card.linkUrl.startsWith("http://") || card.linkUrl.startsWith("https://")) {
                window.open(card.linkUrl, "_blank", "noopener,noreferrer")
              } else if (card.linkUrl.startsWith("/") || card.linkUrl.startsWith("#")) {
                window.location.href = card.linkUrl
              } else {
                window.open(`https://${card.linkUrl}`, "_blank", "noopener,noreferrer")
              }
            } catch (error) {
              console.warn("Failed to navigate to URL:", card.linkUrl)
            }
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${card.title} - ${card.description}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (card.linkUrl && card.linkUrl !== "#") {
              try {
                if (card.linkUrl.startsWith("http://") || card.linkUrl.startsWith("https://")) {
                  window.open(card.linkUrl, "_blank", "noopener,noreferrer")
                } else if (card.linkUrl.startsWith("/") || card.linkUrl.startsWith("#")) {
                  window.location.href = card.linkUrl
                } else {
                  window.open(`https://${card.linkUrl}`, "_blank", "noopener,noreferrer")
                }
              } catch (error) {
                console.warn("Failed to navigate to URL:", card.linkUrl)
              }
            }
          }
        }}
      >
        {enableGlare && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 50%)`,
              pointerEvents: "none",
              transition: "opacity 0.3s ease-out",
              zIndex: 10, // Ensure glare is always on top
            }}
          />
        )}
        {card.customContent ? (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            {card.customContent}
          </div>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: "50%",
                backgroundImage: `url(${cardImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                backgroundColor: "#1f2937",
              }}
              role="img"
              aria-label={cardImage.alt}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(10, 10, 15, 0.8)",
                  color: "#00e57f",
                  fontSize: tagFont?.fontSize || "10px",
                  fontFamily: tagFont?.fontFamily,
                  fontWeight: tagFont?.fontWeight || "600",
                  fontStyle: tagFont?.fontStyle,
                  letterSpacing: tagFont?.letterSpacing || "0.05em",
                  lineHeight: tagFont?.lineHeight,
                  border: "1px solid rgba(0,229,127,0.3)"
                }}
              >
                {card.tag}
              </div>
            </div>
            <div
              style={{
                padding: "16px",
                height: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 6px 0",
                    color: textColor,
                    fontSize: titleFont?.fontSize || "18px",
                    fontWeight: titleFont?.fontWeight || "bold",
                    fontStyle: titleFont?.fontStyle,
                    fontFamily: titleFont?.fontFamily,
                    letterSpacing: titleFont?.letterSpacing || "-0.02em",
                    lineHeight: titleFont?.lineHeight,
                    width: "max-content",
                    minWidth: "max-content",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    color: textColor,
                    opacity: 0.6,
                    fontSize: descriptionFont?.fontSize || "13px",
                    fontWeight: descriptionFont?.fontWeight,
                    fontStyle: descriptionFont?.fontStyle,
                    fontFamily: descriptionFont?.fontFamily,
                    letterSpacing: descriptionFont?.letterSpacing,
                    lineHeight: descriptionFont?.lineHeight || "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {card.description}
                </p>
              </div>
              {card.linkLabel && (
                <button
                  style={{
                    fontSize: linkFont?.fontSize || "13px",
                    fontWeight: linkFont?.fontWeight || "500",
                    fontStyle: linkFont?.fontStyle,
                    fontFamily: linkFont?.fontFamily,
                    letterSpacing: linkFont?.letterSpacing,
                    lineHeight: linkFont?.lineHeight,
                    color: linkTextColor,
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "4px 0px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "color 0.2s ease",
                    width: "max-content",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkTextColor
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (card.linkUrl && card.linkUrl !== "#") {
                      try {
                        if (card.linkUrl.startsWith("http://") || card.linkUrl.startsWith("https://")) {
                          window.open(card.linkUrl, "_blank", "noopener,noreferrer")
                        } else if (card.linkUrl.startsWith("/") || card.linkUrl.startsWith("#")) {
                          window.location.href = card.linkUrl
                        } else {
                          window.open(`https://${card.linkUrl}`, "_blank", "noopener,noreferrer")
                        }
                      } catch (error) {
                        console.warn("Failed to navigate to URL:", card.linkUrl)
                      }
                    }
                  }}
                >
                  {card.linkLabel}
                  {card.linkIcon && card.linkIcon !== "none" && (
                    <span style={{ fontSize: "14px" }}>{card.linkIcon}</span>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
