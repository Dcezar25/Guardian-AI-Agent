import headerImg from "../assets/header2.jpg";

export default function Header() {
  return (
    <header
      className="relative w-full h-32 md:h-40 flex flex-col items-center justify-center border-b-2 border-blue-600"
      style={{
        backgroundImage: `url(${headerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <h1
        className="relative text-3xl md:text-4xl font-extrabold text-white text-center"
        style={{ WebkitTextStroke: "1.5px #2563eb" }}
      >
        THE GUARDIAN
      </h1>
    </header>
  );
}
