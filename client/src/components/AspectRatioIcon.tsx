
const AspectRatioIcon = ({ ratio }: { ratio: string }) => {
  const iconProps = {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "text-muted-foreground",
  };

  const rectProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
  };

  switch (ratio) {
    case "square":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="10" height="10" {...rectProps} />
        </svg>
      );
    case "landscape_16_9":
      return (
        <svg {...iconProps}>
          <rect x="2" y="5" width="12" height="6" {...rectProps} />
        </svg>
      );
    case "portrait_9_16":
      return (
        <svg {...iconProps}>
          <rect x="5" y="2" width="6" height="12" {...rectProps} />
        </svg>
      );
    case "landscape_4_3":
      return (
        <svg {...iconProps}>
          <rect x="2" y="4" width="12" height="8" {...rectProps} />
        </svg>
      );
    case "portrait_4_3":
      return (
        <svg {...iconProps}>
          <rect x="4" y="2" width="8" height="12" {...rectProps} />
        </svg>
      );
    case "square_hd":
      return (
        <svg {...iconProps}>
          <rect x="2" y="2" width="12" height="12" {...rectProps} />
        </svg>
      );
    default:
      return null;
  }
};

export default AspectRatioIcon;
