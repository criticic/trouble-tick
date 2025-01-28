import fs from 'fs';
import { GeoIpDbName, open } from 'geolite2-redist';
import maxmind, { CityResponse } from 'maxmind';

const tempDir = '/tmp/geolite2-redist/dbs-tmp';

const cityReader = await open(GeoIpDbName.City, (dbPath: string) =>
    maxmind.open<CityResponse>(dbPath), tempDir);


export function getLocation(ip: string) {
    // Ensure the directory exists
    fs.mkdirSync(tempDir, { recursive: true });

    const lookup = cityReader.get(ip);
    if (!lookup) return null;

    console.log(lookup);

    const location = lookup.city?.names?.en
        ? lookup.city.names.en + ', ' + lookup.country?.names?.en
        : lookup.country?.names?.en;

    return location;
}
