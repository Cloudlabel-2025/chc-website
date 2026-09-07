/**
 * The delivery cards remain a CSS-driven, looping carousel. Deliberately do
 * not attach pointer-drag handlers here: each card contains a real link and
 * dragging used to intercept normal clicks.
 */
export default function DeliveryCapacityCarousel({ children }) {
  return (
    <div
      className="chc-delivery-carousel"
      role="region"
      aria-label="Oracle delivery services carousel"
      tabIndex={0}
    >
      {children}
    </div>
  )
}
