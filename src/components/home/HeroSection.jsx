import heroImage from "@/assets/images/hero-image.jpg"

export function HeroSection() {
  return (
    <section className="flex flex-1 w-full justify-center items-center px-8 py-16 bg-[#fafaf9]">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center justify-center text-center md:items-end md:text-right">
          <h1 className="text-4xl md:text-5xl font-bold !text-black leading-tight mb-4">
            Stay <br />
            Informed, <br />
            Stay Inspired
          </h1>
          <p className="text-[#666666] text-sm leading-relaxed">
            Discover a World of Knowledge at Your <br />
            Fingertips. Your Daily Dose of Inspiration <br />
            and Information.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src={heroImage}
            alt="Author portrait"
            className="w-[386px] h-[529px] rounded-2xl object-cover opacity-100 shadow-sm"
          />
        </div>

        <div className="text-left flex flex-col justify-center">
          <span className="text-xs text-gray-500 mb-1">– Author</span>
          <h2 className="text-lg font-bold !text-black mb-4">Teerapat Maeewong</h2>
          <p className="text-[#666666] text-sm leading-relaxed">
            I am a full-stack developer moving from technical support into product
            engineering. After an internship on VR training apps and a bootcamp at
            TechUp, I now focus on building clear, useful web experiences with
            React and Next.js.
          </p>
        </div>
      </div>
    </section>
  )
}
