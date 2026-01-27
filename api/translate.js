import { translate } from "@vitalets/google-translate-api";

export default async function translateHandler(req, res) {
    try {
        const {text, lang} = req.body;
        
        const translated = await Promise.all(
            text.map(async element => {
                const obj = await translate(element, {to: lang})
                return obj.text;
            }));

        res.status(200).json({translated});
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: "Erro interno no servidor" });
    };
};