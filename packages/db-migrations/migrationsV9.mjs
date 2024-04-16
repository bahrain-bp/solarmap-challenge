export async function up(db) {
    await db
      .insertInto('educational_resource')
      .values([
        { title: 'NREL Educational Resources', body: 'Provides educational resources for learning about renewable energy at the National Renewable Energy Laboratory.', resource_url: 'https://www.nrel.gov', resource_img:'' },
        { title: 'Energy Saver 101 Videos', body: 'Energy Saver video series by the U.S. Department of Energy, offering insights into energy efficiency and renewable energy.', resource_url: 'https://www.energy.gov', resource_img:'' },
        { title: 'Clean Energy Educational Resources', body: 'Educational resources for teachers about clean energy provided by the U.S. Department of Energy.', resource_url: 'https://www.energy.gov', resource_img:'' },
        { title: 'Renewable Energy Overview', body: 'National Geographic page explaining various renewable energy sources and their benefits.', resource_url: 'https://education.nationalgeographic.org', resource_img:'' },
        { title: 'Sustainable Systems Educational Videos', body: 'University of Michigans sustainability resources including educational videos on renewable energy.', resource_url: 'https://css.umich.edu', resource_img:'' },
      ])
      .execute();
}
