import React from 'react';
import Image from 'next/image';

export default function ProductPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-3xl font-bold">clinical_notes</span>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Derma<span className="text-primary">AI</span></h2>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Shop</a>
                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Analyze</a>
                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Routine</a>
                <a className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors border-b-2 border-primary py-5" href="#">Consult</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 w-64">
                <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400" placeholder="Search products..." type="text"/>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <span className="material-symbols-outlined">shopping_bag</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <span className="material-symbols-outlined">person</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8 uppercase tracking-widest">
          <a className="hover:text-primary transition-colors" href="#">Skincare</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">Serums</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Advanced Retinol Complex</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Product Visuals */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center p-12">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJlT_77So878t6PAJ9lghnOCbLRTYkCpcYekvR3QBjYnbg4ypOMpDUebNP3GORCj6DSLEf04V3KPo53gsk9Gjc7XnJULePSNZiUCaR5vecXw7fuOdGq9DcABqnpPB65KXeR9tstG_RQyjg-miyNVgT5DUfApCzR1Q_oZpWjj7NcwQlEIa6ewkz_XoJAvCaX98PxNv3yrD4W0xhg8cDzNP1MxItTdEn7ZDKgOY4q5SRC1FHUUtgj0cQAqnMeCpXTiCeyI2Wm-oQagw"
                alt="Advanced Retinol Complex Serum"
                width={500}
                height={625}
                className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg border-2 border-primary flex items-center justify-center p-4">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIrU2MShNvxTjqUHdXVPDGMJWk2hmYCP69AoIf9O9YinSZVVr5m56p-2NstCRjDjZ2OIc1BfS-1Mca1kLF3k48lt9oLBb3Mfoy_Y3fTLo_-ZNyof6mm0yL1uCo-ewGXXJoAIzJr8iIN5bwoJfsGiYRt7MK1Bk9h9baHCd7D7DtWw_s2cYXSQWPNcpzXvz_fAQLG3NzrUjq8KRbNMKMbmSjqYfA5ZTZ-_8gn1SwxLPdhoTKTiultmjHo0i1wOvFUKQNR0MayYakJGM"
                  alt="Detail 1"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQf7qqZ-Of9MAEKw7-FguhWTZ30JAiBwF47BMtKd-ZKVFQlv1sireo3T5_cdzTwedDkWOmgsPSdAgSctbzE1tTn7c5p-GyVOh1W3kmU36bQBz9VDSTIkPZGc0tH-dWVsbOhO0hCZdowgpRqywNGymesW877ATSHdJ5mHzhD5zQ8Z2hXaZtCXXcPdbQR7cUz-GQEm9AQuoXYtvZ8vAoaQx5WkoH0oyfarT2Znfjr2pbLyvrCjVLJ-zNI6MitWgfMKMqvJcoXprAlk"
                  alt="Detail 2"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsxR8fvxctPAJtWFKT2Dno0hgqlnUn1DYngHfKfwJyYRMh70eBe7lyKzhMBXXCNIuO_kRilNC2UYrG2AoPMQSaMmG034KNRSTF4xAVEYDqY3AFu3vYxtqlW2YN1ZT4Ajn8h9uLPKZxdU_ofrOYj-JMd8K0LuWR9aKXjegyFHIczP1Ckw5RkyD_JNdKBsMXQA167zlEDPoTcWeed-XdTdNK4B-68-ropk4UUCn0vXhmMTIM_8awrtjjTIvdlET7E-xS5u49XKW8srA"
                  alt="Detail 3"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 flex-col gap-1 text-slate-400">
                <span className="material-symbols-outlined">play_circle</span>
                <span className="text-[10px] font-bold">VIDEO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Title & Price */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">verified</span> Clinical Grade
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Advanced Retinol <br />Complex 2.5%</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-light text-slate-900 dark:text-white">$88.00</span>
                <div className="flex items-center text-amber-400">
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined text-slate-300">star</span>
                  <span className="ml-2 text-sm text-slate-500 font-medium">(124 Reviews)</span>
                </div>
              </div>
            </div>

            {/* AI Match Score Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="relative flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90">
                    <circle className="text-slate-200 dark:text-slate-800" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6"></circle>
                    <circle className="text-primary" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226" strokeDashoffset="13" strokeWidth="6"></circle>
                  </svg>
                  <span className="absolute text-xl font-black text-slate-900 dark:text-white">94%</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI Personal Match</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Based on your skin scan from 2 days ago. Highly compatible with your <span className="font-bold text-primary">combination skin</span> profile.</p>
                </div>
              </div>
            </div>

            {/* Why it works for you */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Why it works for you</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Targets Hyperpigmentation:</span> The 2.5% Retinol concentration matches your dark spot intensity score.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Hydration Balance:</span> Added Squalane counteracts the dryness reported in your T-zone.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Texture Smoothing:</span> Formulated to minimize the fine lines identified around your eye area.</p>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <div className="pt-4 space-y-3">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group">
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">add_task</span>
                ADD TO ROUTINE
              </button>
              <p className="text-center text-xs text-slate-400 font-medium">Free clinical shipping on orders over $50</p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
              <div className="text-center">
                <span className="material-symbols-outlined text-slate-400 mb-1">science</span>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Vegan</p>
              </div>
              <div className="text-center">
                <span className="material-symbols-outlined text-slate-400 mb-1">eco</span>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Clean</p>
              </div>
              <div className="text-center">
                <span className="material-symbols-outlined text-slate-400 mb-1">biotech</span>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Clinically Proven</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Key Ingredients */}
        <section className="mt-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Active Molecular Profile</h2>
            <p className="text-slate-500 leading-relaxed">Every ingredient is selected by our AI based on clinical efficacy data and bio-compatibility standards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">matter</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Encapsulated Retinol</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Slow-release technology minimizes irritation while maximizing cellular turnover.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Hyaluronic Acid</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Multi-molecular weight spheres penetrate deep for sustained hydration.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">shield_moon</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Niacinamide</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Strengthens the lipid barrier and calms redness from external stressors.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Peptide Complex</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Signal molecules that trigger natural collagen production in the dermis.</p>
            </div>
          </div>
        </section>

        {/* Section: Dermatologist Notes */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-900 dark:bg-black rounded-3xl p-12 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATxbReEIyWe_9QfvtmqcHPOwHMMHBYhu2zd7-s8wOBhPpiEezxmwlpGiS04AdI1ag60dAyQEoN-O1yekk8nbDppksj1RSyNK0n9mfkRylC7FnVRG27CTP2txd5X_Tk310Ko-x3R0JLLLwZNjiDsEnoaxfnVOw1ztQNGPtCnm3In3Vmb9vHKAPyQm16SRk8KgWKVGn_TjZ9fyvDxYiX4cV7uFcsrh05AKawL-QB2Mdidw7Tajtq-vTMiv9wxrfEv2OHwyqI-AN92cY"
              alt="Medical pattern"
              width={400}
              height={800}
              className="h-full object-cover"
            />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase">Expert Perspective</div>
            <h2 className="text-4xl font-black">Clinically Verified Formulation</h2>
            <p className="text-slate-300 text-lg leading-relaxed italic">
              &quot;The encapsulation of the retinol in this complex allows for nightly use without the typical &apos;retinol burn.&apos; It&apos;s a balanced approach to high-potency anti-aging that fits perfectly into the AI-tailored regimens we build.&quot;
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-14 h-14 rounded-full border-2 border-primary overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv_WLYfU6E4XJ2v4Xl43-qr3tOn-zo4-Zq7yubTiGjbS4zd42Hf44JsdyZs2Dzl4FY4OdqSl-sLVFaV1VavzbFw1luvdt45Jf7NE8ISDXF_ebMcAgDLBRPe-v_cm0qzeujt-9RX_y8h_8sX7dO65s8HyVAGtqifhYMEc1HFbYSgMdNxLFUojRDoOVfp8POg5IM0E-1XxoCqh7ktpIOqprrK6JFj5ptgXbWJQ9sftYyWeHSRIN2Xk161hZeBkx90CwTvWOWAk-JxAA"
                  alt="Dr. Sarah Chen"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-white">Dr. Sarah Chen, MD</p>
                <p className="text-sm text-primary">Chief Dermatologist, DermaAI Labs</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-3xl font-black text-primary mb-1">90%</h3>
              <p className="text-sm text-slate-400">Saw brighter skin in just 2 weeks of nightly use.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-3xl font-black text-primary mb-1">85%</h3>
              <p className="text-sm text-slate-400">Reported visible reduction in fine lines.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-3xl font-black text-primary mb-1">98%</h3>
              <p className="text-sm text-slate-400">Agreed it was gentle enough for everyday use.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <h3 className="text-3xl font-black text-primary mb-1">100%</h3>
              <p className="text-sm text-slate-400">Fragrance-free and hypoallergenic formula.</p>
            </div>
          </div>
        </section>

        {/* Section: Customer Reviews */}
        <section className="mt-24 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Social Proof</h2>
              <p className="text-slate-500">Real results from our AI community.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-400">Filter by Skin:</span>
              <select className="rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-primary">
                <option>All Types</option>
                <option>Oily / Acne Prone</option>
                <option>Dry / Sensitive</option>
                <option>Combination</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">EM</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Elena M.</p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400 scale-75 -ml-2">
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Verified Purchase</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase">Oily / Sensitive</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                &quot;I was nervous about starting retinol with my sensitive skin, but the AI recommendation was spot on. No irritation at all, and my skin texture is noticeably smoother after 3 weeks.&quot;
              </p>
            </div>
            {/* Review 2 */}
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JR</div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">James R.</p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400 scale-75 -ml-2">
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined fill-1">star</span>
                        <span className="material-symbols-outlined text-slate-300">star</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Verified Purchase</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase">Combination</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                &quot;Finally a retinol that doesn&apos;t feel heavy or greasy. My hyperpigmentation is fading, and I love seeing how it matches my specific skin profile.&quot;
              </p>
            </div>
          </div>
          <div className="text-center">
            <button className="text-primary font-bold hover:underline">View All 124 Reviews</button>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="mt-32 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl font-bold">clinical_notes</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Derma<span className="text-primary">AI</span></h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Personalizing skincare through artificial intelligence and clinical precision. Your skin, decoded.</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined text-lg">public</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined text-lg">mail</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">AI Analysis</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Digital Consultation</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Routine Builder</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Clinical Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Account</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">Profile</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Orders</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Subscriptions</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Skin History</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Join the Lab</h4>
            <p className="text-sm text-slate-500 mb-4">Get AI skin insights and product releases.</p>
            <div className="flex">
              <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-l-lg text-sm focus:ring-primary" placeholder="Email address" type="email" />
              <button className="bg-primary px-4 rounded-r-lg text-white font-bold text-sm">JOIN</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 text-center text-xs text-slate-400">
          © 2024 DermaAI Personalized Skincare. All clinical claims are backed by lab trials.
        </div>
      </footer>
    </div>
  );
}
