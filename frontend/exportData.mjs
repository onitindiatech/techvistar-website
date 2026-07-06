import { createServer } from 'vite';
import fs from 'fs';

async function exportData() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const faqsModule = await vite.ssrLoadModule('/src/data/faqs.ts');
    const servicesModule = await vite.ssrLoadModule('/src/data/services.ts');
    const solutionsModule = await vite.ssrLoadModule('/src/data/solutions.ts');
    const projectsModule = await vite.ssrLoadModule('/src/data/projects.ts');
    const careersModule = await vite.ssrLoadModule('/src/data/careers.ts');

    const extractIconName = (val, iconMap) => {
      if (!val) return 'Circle';
      if (typeof val === 'string') return val;
      if (iconMap) {
        for (const [k, v] of Object.entries(iconMap)) {
          if (v === val) return k;
        }
      }
      return val.displayName || val.name || 'Circle';
    };

    const processArray = (arr, iconMap) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        const newItem = { ...item };
        if (newItem.icon) newItem.icon = extractIconName(newItem.icon, iconMap);
        
        if (newItem.detailedOfferings) {
          newItem.detailedOfferings = newItem.detailedOfferings.map(o => ({
            ...o,
            iconName: typeof o.iconName === 'string' ? o.iconName : extractIconName(o.icon, iconMap)
          }));
        }

        if (newItem.stats) {
          newItem.stats = newItem.stats.map(s => ({
            ...s,
            iconType: typeof s.iconType === 'string' ? s.iconType : extractIconName(s.icon, iconMap)
          }));
        }
        
        return newItem;
      });
    };

    const data = {
      faqs: processArray(faqsModule.FAQs),
      services: processArray(servicesModule.SERVICES, servicesModule.ICON_MAP || {}),
      solutions: processArray(solutionsModule.SOLUTIONS_DATA, solutionsModule.ICON_MAP || {}),
      projects: processArray(projectsModule.PROJECTS, projectsModule.ICON_MAP || {}),
      jobs: processArray(careersModule.CAREERS)
    };

    fs.writeFileSync('seed.json', JSON.stringify(data, null, 2));
    console.log('Successfully generated seed.json');
  } catch (err) {
    console.error('Error generating seed.json', err);
  } finally {
    vite.close();
  }
}

exportData();
