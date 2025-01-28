import { GeoIpDbName, open } from 'geolite2-redist';
import maxmind, { CityResponse } from 'maxmind';

// const countryReader = await open(
//     GeoIpDbName.Country,
//     (path: string) => maxmind.open<CountryResponse>(path)
// );

const cityReader = await open(GeoIpDbName.City, (path: string) =>
    maxmind.open<CityResponse>(path),
);

export function getLocation(ip: string) {
    const lookup = cityReader.get(ip);
    if (!lookup) return null;
    console.log(lookup);
    const location = lookup.city?.names?.en
        ? lookup.city.names.en + ', ' + lookup.country?.names?.en
        : lookup.country?.names?.en;
    return location;
}
