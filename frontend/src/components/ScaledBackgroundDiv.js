export default function ScaledBackgroundDiv({ childPage }) {
  return (
    <div
      className="h-screen w-screen bg-albums bg-contain bg-center flex justify-center items-center"
      background-repeat="no-repeat"
      background-size="cover"
    >
      {childPage}
    </div>
  );
}
