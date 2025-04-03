export default function StaticEffect() {
  return (
    <div className="absolute inset-0 bg-codec-dark z-40 animate-static" aria-hidden="true">
      <svg 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="staticNoise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch"
            seed={Math.random() * 100}
          />
        </filter>
        <rect 
          width="100%" 
          height="100%" 
          filter="url(#staticNoise)" 
          opacity="0.2" 
          fill="#8bac0f"
        />
      </svg>
    </div>
  );
}
