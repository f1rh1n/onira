export default function Logo({ size = "text-3xl" }: { size?: string }) {
  return (
    <span className={`${size} font-bold tracking-wider`}>
      <span className="text-purple-600">O</span>
      <span className="text-purple-600">N</span>
      <span className="text-blue-500">I</span>
      <span className="text-purple-600">R</span>
      <span className="text-purple-600">A</span>
    </span>
  );
}
