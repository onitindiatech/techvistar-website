import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICES, Service } from '@/data/services';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import servicesBg from '../assets/services-bg.png';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Filter out active services
  const activeServices = SERVICES.filter((s) => s.status === 'active');

  // Get unique categories dynamically
  const categories = ['All', ...Array.from(new Set(activeServices.map((s) => s.category)))];

  // Filter services by category
  const filteredServices = selectedCategory === 'All'
    ? activeServices
    : activeServices.filter((s) => s.category === selectedCategory);

  // Sort by order
  const sortedServices = [...filteredServices].sort((a, b) => a.order - b.order);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50">
        <Navbar />

        {/* Services Hero */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative overflow-hidden bg-zinc-950 pt-20 pb-12 md:pt-24 md:pb-16 border-b border-zinc-900"
        >
          {/* Animated Mesh Waves + Mouse Parallax */}
          <motion.div 
            className="absolute inset-0 opacity-85 pointer-events-none z-0"
            style={{ 
              backgroundImage: `url(${servicesBg})`,
              backgroundSize: 'auto 100%',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
            }}
            animate={{
              x: [0, 8, 0],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${servicesBg})`,
                backgroundSize: 'auto 100%',
                backgroundPosition: 'right',
                backgroundRepeat: 'no-repeat',
              }}
              animate={{
                x: mousePosition.x * 10,
                y: mousePosition.y * 10,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
            />
          </motion.div>

          {/* Grid Pulse */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
            animate={{
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Gradient Breathing (Background radial glow) */}
          <motion.div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none z-0"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.65, 0.6],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Light Sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(20, 184, 166, 0.05) 45%, rgba(20, 184, 166, 0.1) 50%, rgba(20, 184, 166, 0.05) 55%, transparent 70%)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-teal-400/40 rounded-full blur-[0.5px]"
                style={{
                  width: `${3 + (i % 3)}px`,
                  height: `${3 + (i % 3)}px`,
                  left: `${(i * 14) + 12}%`,
                  top: `${(i * 11) + 20}%`,
                }}
                animate={{
                  y: [0, -25, 0],
                  x: [0, 6, 0],
                  opacity: [0.1, 0.5, 0.1],
                }}
                transition={{
                  duration: 16 + (i % 3) * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-0 pointer-events-none" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-display relative inline-block pb-2"
            >
              Our Services
              {/* Underline Animation */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-zinc-300 max-w-2xl leading-relaxed mt-2"
            >
              We offer structured, productized growth services spanning full-stack delivery, revenue operations, automation, and applied artificial intelligence.
            </motion.p>
          </div>
        </motion.section>

        {/* Category Filters */}
        <section className="py-8 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {sortedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map((service: Service) => {
                  const IconComponent = service.icon;
                  return (
                    <Card
                      key={service.id}
                      className="group h-full flex flex-col overflow-hidden border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/25 transition-all duration-[450ms] ease-in-out"
                    >
                      {/* Service Cover Image */}
                      <div className="overflow-hidden" style={{ borderRadius: '20px 20px 0 0' }}>
                        <img
                          src={service.coverImage}
                          alt={service.title}
                          loading="lazy"
                          className="w-full h-[180px] md:h-[220px] object-cover transition-transform duration-[450ms] ease-in-out group-hover:scale-105"
                        />
                      </div>
                      <CardHeader className="space-y-3 pb-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="w-fit text-xs font-medium bg-primary/10 text-primary border border-primary/15"
                          >
                            {service.category}
                          </Badge>
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-primary group-hover:scale-105 transition-transform">
                            <IconComponent className="h-5 w-5" />
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold font-display text-slate-900 leading-snug hover:text-primary transition-colors">
                          <Link to={`/services/${service.slug}`}>{service.title}</Link>
                        </CardTitle>
                        <CardDescription className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {service.shortDescription}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-grow pt-0 justify-between">
                        <div className="mt-4 mb-6">
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2.5">
                            Key Offerings
                          </p>
                          <ul className="space-y-2">
                            {service.offerings.slice(0, 3).map((item, index) => (
                              <li key={index} className="flex gap-2 text-xs text-slate-600 items-start">
                                <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          to={`/services/${service.slug}`}
                          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                        >
                          Learn more
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-xl max-w-md mx-auto px-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">No services found.</h3>
                <p className="text-slate-500 text-sm">
                  Try changing your category filter.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Services;
