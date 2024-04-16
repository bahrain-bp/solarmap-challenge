export async function up(db) {

    await db
      .insertInto('consultant')
      .values([
        { name: 'Ansari Engineering Services', level: 'A', crep_num: 'BN/34', contact_info: 17534123, fax: 17533340 },
        { name: 'Bahrain Engineering Bureau', level: 'A', crep_num: 'BN/80', contact_info: 17271718, fax: 17262180 },
        { name: 'Gulf House Engineering', level: 'A', crep_num: 'BN/105', contact_info: 17822666, fax: 17820666 },
        
        { name: 'SJM Electromechanical Engineering Bureau', level: 'B', crep_num: 'BN/177', contact_info: 17382264, fax: 17382267 },
        { name: 'Sunergy Solar Panels W.L.L.', level: 'B', crep_num: 'BN/218', contact_info: 17536000, fax: 17536666 },
        { name: 'Hameed Engineering', level: 'B', crep_num: 'BN/140', contact_info: 17879385, fax: 17680526 },
        
        { name: 'Adel Ahmadi Associates', level: 'C', crep_num: 'BN/79', contact_info: 17225371, fax: 17223964 },
        { name: 'Akbari Architects', level: 'C', crep_num: 'BN/100', contact_info: 17230881, fax: 17232261 },
        { name: 'Al Aali Engineering Consultants', level: 'C', crep_num: 'BN/143', contact_info: 17704616, fax: 17703273 },
        { name: 'Al Diyar Engineering', level: 'C', crep_num: 'BN/117', contact_info: 17311309, fax: 17294824 },
        { name: 'Al Hadi Engineering', level: 'C', crep_num: 'BN/103', contact_info: 17779700, fax: 17775600 }
      ])
      .execute();

    await db
      .insertInto('contractor')
      .values([
        { name: 'Al Jasra Electrical Contracting', level: 'A', license_num: '111556', contact_info: 17251444, fax: 17242332 },
        { name: 'Al Komed Engineering Services', level: 'A', license_num: '16360', contact_info: 17698500, fax: 17694692 },
        { name: 'Mechanical Contracting & Services', level: 'A', license_num: '113197', contact_info: 17623723, fax: 17624082 },
        { name: 'Shereen Tower Construction', level: 'A', license_num: '114477', contact_info: 77103338, fax: 77103339 },
        
        { name: 'A.Karim Al Jahromi Contracting', level: 'B', license_num: '113097', contact_info: 17831000, fax: 17831010 },
        { name: 'Abdulhadi Al Afoo', level: 'B', license_num: '111956', contact_info: 17874756, fax: 17874754 },
        { name: 'Abdulrahman Ali AlSaad Power Projects', level: 'B', license_num: '110996', contact_info: 17273330, fax: 17273331 },
        { name: 'Abdulrahman Ebrahim Al Moosa', level: 'B', license_num: '111396', contact_info: 17531235, fax: 17531236 },
        { name: 'Airmech Company (Moh Jalal & Sons)', level: 'B', license_num: '16390', contact_info: 17533311, fax: 17001509 },
        { name: 'Al Ahlia Contracting', level: 'B', license_num: '16540', contact_info: 17737000, fax: 17737070 },
        
        { name: 'Ahad Electrical Contracting', level: 'C', license_num: '210556', contact_info: 17271203, fax: 17271049 },
        { name: 'Selcon', level: 'C', license_num: '28736', contact_info: 17877582, fax: 17877584 },
        { name: 'Pavilion Energy W.L.L', level: 'C', license_num: '216096', contact_info: 77939477, fax: 77939477 }, 
        { name: 'Sun Light Electrical Contracting', level: 'C', license_num: '210816', contact_info: 17241407, fax: 17241407 },
        { name: 'Utility Ele & Mechanical Contracting Co', level: 'C', license_num: '213476', contact_info: 17741854, fax: 17741859 },

        { name: 'Al Harbi Contracting', level: 'D', license_num: '314476', contact_info: 17780017, fax: null },
        { name: 'Amanigate Contracting', level: 'D', license_num: '314996', contact_info: 13624326, fax: 13621356 }
      ])
      .execute();

}

