export default async function handler(req, res) {
    try {
        const svg = req.files.svg;
        // Esegui qui la logica di salvataggio del file sul server
        res.status(200).send("File caricato con successo");
    } catch (err) {
        console.error(err);
        res.status(500).send("Errore durante il caricamento del file");
    }
}