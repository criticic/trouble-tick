import fs from 'fs';
import { GeoIpDbName, open } from 'geolite2-redist';
import maxmind, { CityResponse } from 'maxmind';


export async function getLocation(ip: string) {
    const tempDir = '/tmp';
    fs.mkdirSync(tempDir, { recursive: true });

    const cityReader = await open(GeoIpDbName.City, (dbPath: string) =>
        maxmind.open<CityResponse>(dbPath), tempDir);

    const lookup = cityReader.get(ip);
    if (!lookup) return null;

    console.log(lookup);

    const location = lookup.city?.names?.en
        ? lookup.city.names.en + ', ' + lookup.country?.names?.en
        : lookup.country?.names?.en;

    return location;
}
