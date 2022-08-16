type Props = {
  x: number;
  y: number;
  text: string | null;
};

export default function MapTooltip({ x, y, text }: Props) {
  if (!text) return null;
  return (
    <div
      className="fixed bg-gray-700 px-2 py-0.5 text-white rounded-sm shadow -translate-x-1/2 -translate-y-1/2 -mt-6"
      style={{ top: y, left: x }}
    >
      {text}
    </div>
  );
}
