export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent border-t-brand-400 border-r-accent-500 animate-spin`}
        />
        <div
          className={`absolute inset-1 rounded-full border-2 border-transparent border-b-brand-300 animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "0.6s" }}
        />
      </div>
    </div>
  );
}
