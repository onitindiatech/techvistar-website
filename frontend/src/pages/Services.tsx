import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getActiveServices } from '@/services/services.service';
import { getServicesCmsConfig } from '@/services/servicesCmsConfig.service';
import { Service, decorateService, getServiceCardImage, IMAGE_MAP } from '@/data/services';
import { usePageSeo } from '@/hooks/usePageSeo';
import { mergeServicesCmsConfig } from '@/types/servicesCms';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, AlertCircle } from 'lucide-react';
import servicesBg from '../assets/services-bg.png';
import { PageHeader } from '@/components/ui/PageHeader';

function resolveLandingBackground(imageKeyOrUrl: string): string {
  const trimmed = imageKeyOrUrl.trim();
  if (!trimmed) return servicesBg;
  if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return IMAGE_MAP[trimmed] || servicesBg;
}

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: cmsConfigApi } = useQuery({
    queryKey: ['servicesCmsConfig'],
    queryFn: getServicesCmsConfig,
    staleTime: 60_000,
  });

  const cmsConfig = mergeServicesCmsConfig(cmsConfigApi);
  const landing = cmsConfig.landing;

  usePageSeo({
    title: landing.seoTitle,
    description: landing.seoDescription,
    fallbackTitle: 'Our Services | TechVistar',
  });

  const { data: apiServices, isLoading, isError, error } = useQuery({
    queryKey: ['activeServices'],
    queryFn: () => getActiveServices(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const activeServices = (apiServices || []).map((item: any) => decorateService(item));
  const categories = ['All', ...Array.from(new Set(activeServices.map((s) => s.category)))];
  const filteredServices =
    selectedCategory === 'All'
      ? activeServices
      : activeServices.filter((s) => s.category === selectedCategory);
  const sortedServices = [...filteredServices].sort((a, b) => a.order - b.order);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-slate-50">
        <Navbar />

        <PageHeader
          title={landing.title}
          subtitle={landing.subtitle}
          description={landing.description}
          backgroundImage={resolveLandingBackground(landing.backgroundImage)}
        />

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

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between animate-pulse h-[350px]"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center max-w-lg mx-auto">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Failed to load services</h3>
                <p className="text-red-700 text-sm leading-relaxed mb-6">
                  {error instanceof Error ? error.message : 'An unexpected server error occurred.'}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload Page
                </Button>
              </div>
            ) : sortedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map((service: Service) => {
                  const IconComponent = service.icon;
                  return (
                    <Card
                      key={service.id}
                      className="group h-full flex flex-col overflow-hidden border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/25 transition-all duration-[450ms] ease-in-out"
                    >
                      <div className="overflow-hidden bg-white" style={{ borderRadius: '20px 20px 0 0' }}>
                        <img
                          src={getServiceCardImage(service)}
                          alt={service.title}
                          loading="lazy"
                          className="w-full h-[200px] md:h-[250px] object-contain p-2 transition-transform duration-[450ms] ease-in-out group-hover:scale-105"
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
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-primary">
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
                            {landing.offeringsLabel}
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
                          {landing.learnMoreLabel}
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
                <p className="text-slate-500 text-sm">Try changing your category filter.</p>
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
