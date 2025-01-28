import { geolocation, ipAddress } from '@vercel/functions';
import { find } from 'geo-tz';

export async function GET(req: Request) {
    const { country, city, latitude, longitude } = geolocation(req);
    const ip = ipAddress(req);

    const timezone = find(parseFloat(latitude!), parseFloat(longitude!));

    return new Response(
        JSON.stringify({ timezone, country, city, latitude, longitude, ip }),
    );
}
