export default async function weatherHandler(req, res) {
    try {
        const {loc} = req.body;
        const formatedLoc = encodeURIComponent(loc);

        const raw = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${formatedLoc}?unitGroup=metric&include=elements=datetime,temp,precip,precipprob,windspeed,windgust,humidity,pressure,uvindex,sunrise,sunset,moonphase&key=${process.env.VISUAL_CROSSING_KEY}&contentType=json`);

        if (!raw.ok) {
            throw new Error(raw.message);
        };

        const data = await raw.json();

        res.status(200).json({data});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    };
};