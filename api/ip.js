export default async function ipHandler(req, res) {
    try {
        const raw = await fetch("http://ip-api.com/json/");
        const data = await raw.json();

        if (!raw.ok) {
            throw new Error(raw.message)
        }

        res.status(200).json({data});
    } catch (error) {
        console.error(error);
    };
};